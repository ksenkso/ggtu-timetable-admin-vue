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
          <div class="lesson" v-for="(entry, index) in currentDay" :key="entry.id">
            <component
                :is="lessonView(entry.lesson)"
                :lesson="entry.lesson"
                :index="index"
                @submit="saveLesson"
                @remove="removeLesson"
                @empty="makeWindow"
            ></component>
          </div>
        </div>
      </template>
    </div>
  </Page>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import Page from '../Page.vue';
import { CreateLessonDto, Lesson, UpdateLessonDto, Week } from 'ggtu-timetable-api-client';
import { Day } from 'ggtu-timetable-api-client';
import { NavigationGuardNext, Route } from 'vue-router';
import RegularEntryForm from '@/views/timetables/LessonForm.vue';
import LessonForm from '@/views/timetables/LessonForm.vue';
import { ButtonGroupValue } from '@/components/common/ButtonGroup.vue';
import WeekPicker from '@/components/timetable/WeekPicker.vue';
import DayPicker from '@/components/timetable/DayPicker.vue';
import { namespace } from 'vuex-class';
import MockLesson from '@/components/timetable/MockLesson.vue';
import { LessonHolder } from '@/utils/timetables';
import { REMOVE_LESSON, SET_DAY, SET_GROUP_ID, SET_LESSON_TO_UPDATE, SET_WEEK } from '@/store/editor/mutations-types';
import { SET_WINDOW } from '@/store/editor/mutations-types';
import LessonView from '@/views/timetables/LessonView.vue';
import { ADD_LESSON, GET_GROUP, GET_LESSONS_FOR_WEEK, UPDATE_LESSON } from '@/store/editor/action-types';
import { CREATE_EMPTY_LESSON } from '@/store/editor/action-types';
import { EditorState, KeyedObjectMaybe } from '@/store/editor/types';
import { KeyedObject } from '@/store/editor/types';

Component.registerHooks([
  'beforeRouteEnter',
]);
const editor = namespace('editor');

@Component({
  name: 'Timetable',
  components: { Page, RegularEntryForm, WeekPicker, DayPicker, MockLesson, LessonView, LessonForm }
})
export default class Timetable extends Vue {

  @editor.State(state => state) editor!: EditorState
  @editor.Action(GET_GROUP) getGroup!: (groupId: number) => Promise<void>;
  @editor.Action(GET_LESSONS_FOR_WEEK)
  getLessonsForWeek!: ({ groupId, week }: { groupId: number; week: Week }) => Promise<void>;
  @editor.Action(UPDATE_LESSON) updateLesson!: (lesson: UpdateLessonDto) => Promise<void>;
  @editor.Action(ADD_LESSON) addLesson!: (lesson: CreateLessonDto) => Promise<void>;
  @editor.Mutation(SET_GROUP_ID) setGroupId!: (id: number) => void;
  @editor.Mutation(SET_WEEK) setWeek!: (id: number) => void;
  @editor.Mutation(SET_DAY) setDay!: (id: number) => void;
  @editor.Mutation(SET_LESSON_TO_UPDATE) setLessonToUpdate!: (lesson: Lesson | null) => void;
  @editor.Mutation(SET_WINDOW) setWindow!: ({ week, day, index }: { week: Week; day: Day; index: number }) => void;
  @editor.Mutation(REMOVE_LESSON) removeLesson!: (lesson: Lesson) => void;
  @editor.Action(CREATE_EMPTY_LESSON) createLesson!: () => KeyedObject<'lesson', Lesson>;
  @Ref() forms!: LessonHolder[];
  @Ref() lessonsContainer!: HTMLDivElement;

  @editor.Getter('currentDay')
  currentDay!: KeyedObjectMaybe<'lesson', Lesson>[];
  isLoading = false;

  get title() {
    return this.editor.group ? `Расписание: ${this.editor.group.name}` : 'Загрузка...';
  }

  get notEmptyDay() {
    return this.currentDay && this.currentDay.length;//.some(entry => entry.lesson);
  }

  makeWindow(index: number) {
    console.log(index);
    this.setLessonToUpdate(null);
    this.setWindow({ week: this.editor.week, day: this.editor.day, index });
  }

  lessonView(lesson: Lesson | null) {
    return this.editor.lessonToUpdate && lesson && this.editor.lessonToUpdate.id === lesson.id ? 'LessonForm' : 'LessonView';
  }

  async addLessonForm() {
    const newEntry = await this.createLesson();
    this.currentDay.push(newEntry);
    this.setLessonToUpdate(newEntry.lesson);
    this.$nextTick(() => {
      const card = (this.lessonsContainer.lastElementChild as HTMLElement);
      const page = document.querySelector('.page__content');
      // listen for scroll event on page content to determine if smooth scrolling has ended
      // if there were no scroll events in 100ms, then consider that scrolling has ended
      let timeout: number, called = false;
      const checkScroll = () => {
        clearTimeout(timeout);
        called = true;
        timeout = setTimeout(() => {
          (page as HTMLDivElement).removeEventListener('scroll', checkScroll);
          const input = card.querySelector('input') as HTMLInputElement;
          input.focus();

        }, 100);
      }
      (page as HTMLDivElement).addEventListener('scroll', checkScroll);
      card.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if (!called) {
          const input = card.querySelector('input') as HTMLInputElement;
          input.focus();
        }
      }, 100);
    })
  }

  tryRemoveLesson(lesson: Lesson) {
    const shouldRemove = confirm(`Удалить пару ${lesson.index + 1}?`);
    if (shouldRemove) {
      this.removeLesson(lesson);
    }
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

  loadEntries(groupId: number): Promise<void> {
    this.isLoading = true;
    return this.getGroup(groupId)
        .then(() => this.getLessonsForWeek({ groupId, week: this.editor.week }))
        .then(() => {
          this.isLoading = false;
        });
  }

  mounted() {
    console.log(this.editor.day, this.editor.week, this.currentDay);
  }

  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    if (!to.params.groupId) {
      next('/groups');
    } else {
      next((vm: Vue) => {
        const instance = vm as Timetable;
        if (!instance.editor.week) {
          instance.setWeek(0);
        }
        if (!instance.editor.day) {
          instance.setDay(0);
        }
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
