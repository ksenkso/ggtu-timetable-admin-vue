<template>
  <Page :title="title">
    <div class="page__shrink">
      <WeekPicker :default-week="editor.week" @change="chooseWeek"></WeekPicker>
      <DayPicker :default-day="editor.day" @change="chooseDay"></DayPicker>
      <Button @click.native="addLessonForm" theme="primary">Добавить пару</Button>
      <template v-if="isLoading">
        <Alert theme="warning">Загрузка...</Alert>
      </template>
      <template v-else>
        <Alert v-if="!notEmptyDay" theme="warning">Нет занятий в этот день</Alert>
        <div class="fragments" v-if="notEmptyDay" ref="lessonsContainer">
          <div class="lesson" v-for="entry in currentDay" :key="entry.id">
            <component
                v-if="entry.lesson"
                :is="lessonView(entry.lesson)"
                :lesson="entry.lesson"
                @submit="saveLesson"
            ></component>
            <MockLesson v-else :index="entry.lesson.index" @set="setLesson"></MockLesson>
          </div>
        </div>
      </template>
    </div>
  </Page>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator';
import Page from "../Page.vue";
import {Cabinet, CreateLessonDto, Lesson, LessonType, Subject, UpdateLessonDto, Week} from 'ggtu-timetable-api-client';
import {NavigationGuardNext, Route} from 'vue-router';
import RegularEntryForm from '@/views/timetables/LessonForm.vue';
import {ButtonGroupValue} from '@/components/common/ButtonGroup.vue';
import WeekPicker from '@/components/timetable/WeekPicker.vue';
import DayPicker from '@/components/timetable/DayPicker.vue';
import {namespace} from 'vuex-class';
import MockLesson from '@/components/timetable/MockLesson.vue';
import {LessonHolder} from '@/utils/timetables';
import {REMOVE_LESSON, SET_DAY, SET_GROUP_ID, SET_LESSON_TO_UPDATE, SET_WEEK} from "@/store/editor/mutations-types";
import LessonView from "@/views/timetables/LessonView.vue";
import {ADD_LESSON, GET_GROUP, GET_LESSONS_FOR_WEEK, UPDATE_LESSON} from "@/store/editor/action-types";
import {EditorState, KeyedObjectMaybe} from "@/store/editor/types";
import {v4} from "uuid";
import LessonForm from "@/views/timetables/LessonForm.vue";

Component.registerHooks([
  'beforeRouteEnter',
]);
const editor = namespace('editor');

@Component({
  name: 'Timetable',
  components: {Page, RegularEntryForm, WeekPicker, DayPicker, MockLesson, LessonView, LessonForm}
})
export default class Timetable extends Vue {

  @editor.State(state => state) editor!: EditorState
  @editor.Action(GET_GROUP) getGroup!: (groupId: number) => Promise<void>;
  @editor.Action(GET_LESSONS_FOR_WEEK)
  getLessonsForWeek!: ({groupId, week}: { groupId: number; week: Week }) => Promise<void>;
  @editor.Action(UPDATE_LESSON) updateLesson!: (lesson: UpdateLessonDto) => Promise<void>;
  @editor.Action(ADD_LESSON) addLesson!: (lesson: CreateLessonDto) => Promise<void>;
  @editor.Mutation(SET_GROUP_ID) setGroupId!: (id: number) => void;
  @editor.Mutation(SET_WEEK) setWeek!: (id: number) => void;
  @editor.Mutation(SET_DAY) setDay!: (id: number) => void;
  @editor.Mutation(SET_LESSON_TO_UPDATE) setLessonToUpdate!: (lesson: Lesson | null) => Promise<void>;
  @editor.Mutation(REMOVE_LESSON) removeLesson!: (lesson: Lesson) => void;

  @Ref() forms!: LessonHolder[];
  @Ref() lessonsContainer!: HTMLDivElement;

  @editor.Getter('currentDay')
  currentDay!: KeyedObjectMaybe<'lesson', Lesson>[];
  isLoading = false;

  get title() {
    return this.editor.group ? `Расписание: ${this.editor.group.name}` : 'Загрузка...';
  }

  get notEmptyDay() {
    return this.currentDay && this.currentDay.some(entry => entry.lesson);
  }

  lessonView(lesson: Lesson) {
    return this.editor.lessonToUpdate && this.editor.lessonToUpdate.id === lesson.id ? 'LessonForm' : 'LessonView';
  }

  addLessonForm() {
    const newEntry = {
      id: v4(),
      lesson: {
        teachers: [],
        subject: {} as Subject,
        subjectId: 0,
        cabinetId: 0,
        groupId: this.editor.groupId,
        cabinet: {} as Cabinet,
        day: this.editor.day,
        week: this.editor.week,
        index: this.nextIndex(),
        type: LessonType.Lecture,
        id: 0,
      }
    };
    this.currentDay.push(newEntry);
    this.setLessonToUpdate(newEntry.lesson);
    this.$nextTick(() => {
      (this.lessonsContainer.lastElementChild as HTMLElement).scrollIntoView({behavior: 'smooth'});
    })
  }

  saveLesson(lesson: CreateLessonDto | UpdateLessonDto) {
    let action;
    if ((lesson as UpdateLessonDto).id) {
      action = this.updateLesson(lesson);
    } else {
      action = this.addLesson(lesson as CreateLessonDto)
        .then(() => this.removeLesson(lesson as Lesson));
    }
    action.then(() => {
      this.setLessonToUpdate(null);
    });
  }

  chooseDay(day: ButtonGroupValue) {
    this.setDay(day.index);
  }

  chooseWeek(week: ButtonGroupValue) {
    this.setWeek(week.index);
    this.loadEntries(this.editor.groupId);
  }

  nextIndex() {
    let max = -1;
    for (const entry of this.currentDay) {
      if (entry.lesson && entry.lesson.index > max) {
        max = entry.lesson.index;
      }
    }
    return max + 1;
  }

  loadEntries(groupId: number): Promise<void> {
    this.isLoading = true;
    return this.getGroup(groupId)
        .then(() => this.getLessonsForWeek({groupId, week: this.editor.week}))
        .then(() => {
          this.isLoading = false;
        });
  }

  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    if (!to.params.groupId) {
      next('/groups');
    } else {
      next((vm: Vue) => {
        const instance = vm as Timetable;
        instance.setWeek(0);
        instance.setDay(0);
        instance.loadEntries(+to.params.groupId);
      })
    }
  }
}
</script>

<style scoped lang="sass">
.fragments
  margin-top: 1rem
  display: flex
  flex-direction: column
  row-gap: 1rem

.buttons
  display: flex

  .button
    flex: 0 0 140px
    margin-left: auto

    &_submit
      margin-left: .5rem

.lesson
  h3
    margin-left: 1rem
</style>
