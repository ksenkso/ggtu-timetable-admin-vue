<template>
  <Page :title="title">
    <WeekPicker :default-week="week" @change="chooseWeek"></WeekPicker>
    <DayPicker :default-day="day" @change="chooseDay"></DayPicker>
    <Alert v-if="!notEmptyDay" theme="warning">Нет занятий в этот день</Alert>
    <div class="fragments" v-if="loaded && notEmptyDay">
      <div class="lesson" v-for="(entry, index) in currentDay" :key="entry.id">
        <h3>Пара {{ index + 1 }}</h3>
        <RegularEntryForm ref="forms" v-if="entry.lesson" :index="index" :entry="entry.lesson"
                          @remove="removeLesson"></RegularEntryForm>
        <MockLesson v-else :index="index" @set="setLesson"></MockLesson>
      </div>
    </div>
    <div class="buttons">
      <Button theme="primary" class="button_block" @click.native="addForm">Добавить занятие</Button>
      <Button theme="primary" class="button_block button_submit" @click.native="submitTimetable">Сохранить</Button>
    </div>

  </Page>
</template>

<script lang="ts">
import {v4} from 'uuid';
import {Component, Ref, Vue} from 'vue-property-decorator';
import Page from "../Page.vue";
import {
  Cabinet,
  CreateLessonDto,
  Day,
  Group,
  LessonType,
  UpdateLessonDto,
  Week,
  WithId
} from 'ggtu-timetable-api-client';
import {NavigationGuardNext, Route} from 'vue-router';
import {api} from '@/api';
import RegularEntryForm from '@/views/timetables/RegularEntryForm.vue';
import {ButtonGroupValue} from '@/components/common/ButtonGroup.vue';
import WeekPicker from '@/components/timetable/WeekPicker.vue';
import DayPicker from '@/components/timetable/DayPicker.vue';
import {namespace} from 'vuex-class';
import {NamedEntityDict} from '@/store/entities/types';
import {Dictionary} from 'vue-router/types/router';
import {GET_ALL_ENTITIES} from '@/store/entities/action-types';
import MockLesson from '@/components/timetable/MockLesson.vue';
import {LessonHolder} from '@/utils/timetables';
import {SET_DAY, SET_GROUP_ID, SET_WEEK} from "@/store/editor/mutations-types";

Component.registerHooks([
  'beforeRouteEnter',
]);
const cabinets = namespace('cabinets');
const teachers = namespace('teachers');
const lessons = namespace('subjects');
const editor = namespace('editor');

let loadedTimetable: { id: string; lesson?: CreateLessonDto | UpdateLessonDto }[][][] = [
  [],
  []
];

function createEmptyTimetable(): { id: string; lesson?: CreateLessonDto | UpdateLessonDto }[][][] {
  return [
    [
      [], [], [], [], [], [],
    ], [
      [], [], [], [], [], [],
    ]
  ];
}

@Component({
  name: 'TimetableForm',
  components: {Page, RegularEntryForm, WeekPicker, DayPicker, MockLesson}
})
export default class TimetableForm extends Vue {

  @cabinets.State('entities') cabinets!: Dictionary<Cabinet>;
  @teachers.State('entities') teachers!: NamedEntityDict;
  @lessons.State('entities') lessons!: NamedEntityDict;

  @cabinets.Action(GET_ALL_ENTITIES) getCabinets!: () => Promise<void>;
  @teachers.Action(GET_ALL_ENTITIES) getTeachers!: () => Promise<void>;
  @lessons.Action(GET_ALL_ENTITIES) getLessons!: () => Promise<void>;
  @editor.Mutation(SET_GROUP_ID) setGroupId!: (id: number) => void;
  @editor.Mutation(SET_WEEK) setWeek!: (id: number) => void;
  @editor.Mutation(SET_DAY) setDay!: (id: number) => void;

  @Ref() forms!: LessonHolder[];

  group: WithId<Group> | null = null;
  day = 0;
  week = 0;
  entitiesLoaded = false;
  timetable: { id: string; lesson?: CreateLessonDto | UpdateLessonDto }[][][] = [];
  currentDay: { id: string; lesson?: CreateLessonDto | UpdateLessonDto }[] = [];
  // loadedTimetable: Array<readonly (Lesson | CreateLessonDto)[][]> = [];
  loading = false;

  get title() {
    return this.group ? `Расписание: ${this.group.name}` : 'Загрузка...';
  }

  get loaded() {
    return this.group && !this.loading && this.entitiesLoaded;
  }

  get notEmptyDay() {
    return this.currentDay.some(entry => entry.lesson);
  }

  removeLesson(index: number) {
    if (index === this.currentDay.length - 1) {
      this.currentDay.pop();
    } else {
      Vue.set(this.currentDay, index, this.createEntry(LessonType.Empty));
    }

  }

  setLesson(index: number) {
    Vue.set(this.currentDay, index, this.createEntry());
  }

  componentForEntry(entry: { id?: number }): string {
    return entry.id ? 'RegularEntryForm' : 'MockLesson';
  }

  chooseDay(day: ButtonGroupValue) {
    this.day = day.index;
    this.setDay(this.day);
    this.updateCurrentDay()
  }

  chooseWeek(week: ButtonGroupValue) {
    this.week = week.index;
    this.setWeek(this.week);
    this.loadEntries()
        .then(() => this.updateCurrentDay());
  }

  addForm() {
    this.currentDay.push(this.createEntry());
  }

  submitTimetable() {
    const requests: Promise<any>[] = this.forms
        .map((form) => {
          return form.getLesson();
        })
        // .filter(entry => entry.type !== LessonType.Empty)
        .map(dto => {
          return (dto as UpdateLessonDto).id
              ? api.timetable.update((dto as UpdateLessonDto).id as number, dto)
              : api.timetable.create(dto as CreateLessonDto)
        });
    // check if any subjects were deleted

    const lessonsToRemove = loadedTimetable[this.week][this.day]
        .reduce<number[]>((toRemove, loaded) => {
          if (!this.currentDay.find(entry => {
            return entry.lesson
                && (entry.lesson as UpdateLessonDto).id
                && (entry.lesson as UpdateLessonDto).id === (loaded.lesson as UpdateLessonDto).id;
          })) {
            toRemove.push((loaded.lesson as UpdateLessonDto).id as number);
          }
          return toRemove;
        }, [])
        .map(id => api.timetable.delete(id));
    Promise.all(requests.concat(lessonsToRemove))
        .then(() => {
          alert('SUCCESS');
          location.reload();
        });

  }

  createEntry(type: LessonType = LessonType.Lecture): { id: string; lesson: CreateLessonDto } {
    return {
      id: v4(),
      lesson: {
        // id: Math.random() * 0.9, // use a fake id that is less then 1
        cabinetId: 0,
        day: Day.Monday,
        groupId: this.group?.id || 0,
        index: this.nextIndex(),
        subjectId: 0,
        teacherIds: [],
        type,
        week: Week.Top,
      }
    }
  }

  nextIndex() {
    let max = 0;
    for (const entry of this.currentDay) {
      if (entry.lesson && entry.lesson.index && entry.lesson.index > max) {
        max = entry.lesson.index;
      }
    }
    return max === 0 ? max : max + 1;
  }

  mounted() {
    if (this.group) {
      this.setGroupId(this.group.id);
    }
    this.setDay(this.day);
    this.setWeek(this.week);
    Promise.all([
      this.getCabinets(),
      this.getLessons(),
      this.getTeachers()
    ])
        .then(() => {
          this.entitiesLoaded = true;
        })
  }

  loadEntries(): Promise<any> {
    this.loading = true;
    if (!this.group) return Promise.resolve();
    return api.timetable.getForGroupByWeek(this.group.id, this.week)
        .then(entries => {
          if (!entries.length) {
            this.timetable = createEmptyTimetable();
            loadedTimetable = createEmptyTimetable();
          } else {
            let days: { id: string; lesson?: CreateLessonDto | UpdateLessonDto }[][] = [
              [],
              [],
              [],
              [],
              [],
              [],
            ];
            entries.reduce((days, entry) => {
              days[entry.day].push({
                id: v4(),
                lesson: {...entry, teacherIds: entry.teachers.map(teacher => teacher.id)}
              });
              return days;
            }, days);
            days = days.map((day) => {
              (day as { id: string; lesson: CreateLessonDto }[]).sort((a, b) => a.lesson.index - b.lesson.index);
              /**
               * Go through patches array and fill in null values if indices do not match.
               */
              const filledEntries = [];
              let lessonIndex = 0, entryIndex = 0;
              while (entryIndex < day.length) {
                // this entry is not in its place, so there should be null
                if ((day as { id: string; lesson: CreateLessonDto }[])[entryIndex].lesson.index !== lessonIndex) {
                  filledEntries.push({id: v4()});
                } else {
                  filledEntries.push(day[entryIndex]);
                  entryIndex++;
                }
                lessonIndex++;
              }
              return filledEntries;
            });
            loadedTimetable[this.week] = days.map(day => day.map(entry => Object.assign({}, entry))) as { id: string; lesson?: CreateLessonDto | UpdateLessonDto }[][];
            this.timetable[this.week] = days as { id: string; lesson?: CreateLessonDto | UpdateLessonDto }[][];
            this.updateCurrentDay();
          }
          this.loading = false;
        })
  }

  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    if (!to.params.groupId) {
      next('/groups');
    } else {
      next((vm: Vue) => {
        const $this = vm as TimetableForm;
        api.groups.get(+to.params.groupId)
            .then(group => {
              $this.group = group;
              return $this.loadEntries()
            })
      })
    }
  }

  private updateCurrentDay() {
    this.currentDay = this.timetable[this.week][this.day];
  }
}
</script>

<style scoped lang="sass">
.buttons
  display: flex

  .button
    max-width: 140px
    margin-left: auto

    &_submit
      margin-left: .5rem

.lesson
  h3
    margin-left: 1rem
</style>
