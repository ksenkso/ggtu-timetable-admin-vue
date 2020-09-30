<template>
  <Page :title="title">
    <WeekPicker :default-week="week" @change="setWeek"></WeekPicker>
    <DayPicker :default-day="day" @change="setDay"></DayPicker>
    <Alert v-if="!notEmptyDay" theme="warning">Нет занятий в этот день</Alert>
    <div class="fragments" v-if="loaded && notEmptyDay">
      <div class="lesson" v-for="(entry, index) in currentDay" :key="entry.id">
        <h3>Пара {{ index + 1 }}</h3>
        <component
            ref="forms"
            :is="componentForEntry(entry)"
            :entry="entry"
            :index="index"
            @remove="removeLesson"
            @set="setLesson"
        ></component>
      </div>
    </div>
    <div class="buttons">
      <Button theme="primary" class="button_block" @click.native="addForm">Добавить занятие</Button>
      <Button theme="primary" class="button_block button_submit" @click.native="submitTimetable">Сохранить</Button>
    </div>

  </Page>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator';
import Page from "../Page.vue";
import {
  Cabinet,
  Day,
  Group,
  TimetableEntry,
  TimetableEntryDTO,
  TimetableEntryType,
  Week,
  WithId
} from 'ggtu-timetable-api-client';
import { NavigationGuardNext, Route } from 'vue-router';
import { api } from '@/api';
import RegularEntryForm from '@/views/timetables/RegularEntryForm.vue';
import { ButtonGroupValue } from '@/components/common/ButtonGroup.vue';
import WeekPicker from '@/components/timetable/WeekPicker.vue';
import DayPicker from '@/components/timetable/DayPicker.vue';
import { namespace } from 'vuex-class';
import { NamedEntityDict } from '@/store/entities/types';
import { Dictionary } from 'vue-router/types/router';
import { GET_ALL_ENTITIES } from '@/store/entities/action-types';
import MockLesson from '@/components/timetable/MockLesson.vue';
import { TimetableEntryHolder } from '@/utils/timetables';

Component.registerHooks([
  'beforeRouteEnter',
]);
const cabinets = namespace('cabinets');
const teachers = namespace('teachers');
const lessons = namespace('lessons');
let loadedTimetable: (TimetableEntry | TimetableEntryDTO)[][][] = [
  [],
  []
];
@Component({
  name: 'TimetableForm',
  components: { Page, RegularEntryForm, WeekPicker, DayPicker, MockLesson }
})
export default class TimetableForm extends Vue {

  @cabinets.State('entities') cabinets!: Dictionary<Cabinet>;
  @teachers.State('entities') teachers!: NamedEntityDict;
  @lessons.State('entities') lessons!: NamedEntityDict;

  @cabinets.Action(GET_ALL_ENTITIES) getCabinets!: () => Promise<void>;
  @teachers.Action(GET_ALL_ENTITIES) getTeachers!: () => Promise<void>;
  @lessons.Action(GET_ALL_ENTITIES) getLessons!: () => Promise<void>;

  @Ref() forms!: (RegularEntryForm | MockLesson)[];

  group: WithId<Group> | null = null;
  day = 0;
  week = 0;
  entitiesLoaded = false;
  timetable: (TimetableEntry | TimetableEntryDTO)[][][] = [];
  currentDay: (TimetableEntry | TimetableEntryDTO)[] = [];
  // loadedTimetable: Array<readonly (TimetableEntry | TimetableEntryDTO)[][]> = [];
  loading = false;

  get title() {
    return this.group ? `Расписание: ${this.group.name}` : 'Загрузка...';
  }

  get loaded() {
    return this.group && !this.loading && this.entitiesLoaded;
  }

  get notEmptyDay() {
    return this.currentDay.some(entry => entry.type !== TimetableEntryType.Empty);
  }

  removeLesson(index: number) {
    if (index === this.currentDay.length - 1) {
      this.currentDay.pop();
    } else {
      Vue.set(this.currentDay, index, this.createEntry(TimetableEntryType.Empty));
    }

  }

  setLesson(index: number) {
    Vue.set(this.currentDay, index, this.createEntry());
  }

  componentForEntry(entry: TimetableEntry | TimetableEntryDTO): string {
    return entry.type === TimetableEntryType.Empty ? 'MockLesson' : 'RegularEntryForm';
  }

  setDay(day: ButtonGroupValue) {
    this.day = day.index;
    this.updateCurrentDay()
  }

  setWeek(week: ButtonGroupValue) {
    this.week = week.index;
    this.loadEntries()
        .then(() => this.updateCurrentDay());
  }

  addForm() {
    this.currentDay.push(this.createEntry());
  }

  submitTimetable() {
    const requests: Promise<any>[] = this.forms
        .map((form: TimetableEntryHolder<any>) => {
          return ({
            groupId: this.group && this.group.id,
            day: this.day,
            week: this.week,
            ...form.getTimetableEntry()
          }) as TimetableEntryDTO;
        })
        .filter(entry => entry.type !== TimetableEntryType.Empty)
        .map(dto => {
          return (dto.id as number) < 1
              ? api.timetable.create(dto)
              : api.timetable.update(dto.id as number, dto)
        });
    // check if any lessons were deleted

    const lessonsToRemove = loadedTimetable[this.week][this.day]
        .reduce<number[]>((toRemove, loaded) => {
          if (!this.currentDay.find(entry => entry && entry.id === loaded.id)) {
            toRemove.push(loaded.id as number);
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

  createEntry(type: TimetableEntryType = TimetableEntryType.Lecture): TimetableEntryDTO {
    return {
      id: Math.random() * 0.9, // use a fake id that is less then 1
      cabinetId: 0,
      day: Day.Monday,
      groupId: this.group?.id || 0,
      index: 0,
      lessonId: 0,
      teacherIds: [],
      type,
      week: Week.Top,
    }
  }

  mounted() {
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
            this.timetable = Array(2).fill(0).map(() => ([
              [], [], [], [], [], [],
            ]));
            loadedTimetable = Array(2).fill(0).map(() => ([
              [], [], [], [], [], [],
            ]));
          } else {
            let days: TimetableEntry[][] = [
              [],
              [],
              [],
              [],
              [],
              [],
            ];
            entries.reduce((days, entry) => {
              days[entry.day].push(entry);
              return days;
            }, days);
            days = days.map(day => {
              day.sort((a, b) => a.index - b.index);
              /**
               * Go through entries array and fill in null values if indices do not match.
               */
              const filledEntries = [];
              let lessonIndex = 0, entryIndex = 0;
              while (entryIndex < day.length) {
                // this entry is not in its place, so there should be null
                if (day[entryIndex].index !== lessonIndex) {
                  filledEntries.push(this.createEntry(TimetableEntryType.Empty));
                } else {
                  filledEntries.push(day[entryIndex]);
                  entryIndex++;
                }
                lessonIndex++;
              }
              return filledEntries as TimetableEntry[];
            });
            loadedTimetable[this.week] = days.map(day => day.map(entry => Object.assign({}, entry)));
            this.timetable[this.week] = days;
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

</style>
