<template>
  <Page :title="title">
    <WeekPicker :default-week="week" @change="setWeek"></WeekPicker>
    <DayPicker :default-day="day" @change="setDay"></DayPicker>
    <div class="fragments" v-if="loaded">
      <div class="lesson" v-for="(entry, index) in currentDay" :key="index">
        <h3>Пара {{ index + 1 }}</h3>
        <component
            ref="forms"
            :is="componentForEntry(entry)"
            :entry="entry"
            :index="index"
            @remove="removeLesson(index)"
            @set="setLesson(index)"
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
} from "ggtu-timetable-api-client";
import {NavigationGuardNext, Route} from "vue-router";
import {api} from "@/api";
import TimetableFormFragment from "@/views/timetables/TimetableFormFragment.vue";
import {ButtonGroupValue} from "@/components/common/ButtonGroup.vue";
import WeekPicker from "@/components/timetable/WeekPicker.vue";
import DayPicker from "@/components/timetable/DayPicker.vue";
import {namespace} from "vuex-class";
import {NamedEntityDict} from "@/store/entities/types";
import {Dictionary} from "vue-router/types/router";
import {GET_ALL_ENTITIES} from "@/store/entities/action-types";
import MockLesson from "@/components/timetable/MockLesson.vue";

Component.registerHooks([
  'beforeRouteEnter',
]);
const cabinets = namespace('cabinets');
const teachers = namespace('teachers');
const lessons = namespace('lessons');
@Component({
  name: 'TimetableForm',
  components: {Page, TimetableFormFragment, WeekPicker, DayPicker, MockLesson}
})
export default class TimetableForm extends Vue {

  @cabinets.State('entities') cabinets!: Dictionary<Cabinet>;
  @teachers.State('entities') teachers!: NamedEntityDict;
  @lessons.State('entities') lessons!: NamedEntityDict;

  @cabinets.Action(GET_ALL_ENTITIES) getCabinets!: () => Promise<void>;
  @teachers.Action(GET_ALL_ENTITIES) getTeachers!: () => Promise<void>;
  @lessons.Action(GET_ALL_ENTITIES) getLessons!: () => Promise<void>;

  @Ref() forms!: (TimetableFormFragment | MockLesson)[];

  group: WithId<Group> | null = null;
  day = 0;
  week = 0;
  entitiesLoaded = false;
  timetable: (TimetableEntry | TimetableEntryDTO | null)[][][] = [];
  currentDay: (TimetableEntry | TimetableEntryDTO | null)[] = [];
  loadedTimetable: Array<readonly (TimetableEntry | TimetableEntryDTO)[][]> = [];
  loading = false;

  get title() {
    return this.group ? `Расписание: ${this.group.name}` : 'Загрузка...';
  }

  get loaded() {
    return this.group && !this.loading && this.entitiesLoaded;
  }

  removeLesson(index: number) {
    Vue.set(this.currentDay, index, null);
  }

  setLesson(index: number) {
    Vue.set(this.currentDay, index, this.createEntry());
  }

  componentForEntry(entry: TimetableEntry | TimetableEntryDTO | null): string {
    return entry === null ? 'MockLesson' : 'TimetableFormFragment';
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
    this.timetable[this.week][this.day].push(this.createEntry());
  }

  submitTimetable() {
    const forms = this.forms
        .filter(form => form.$options.name === 'TimetableFormFragment') as TimetableFormFragment[];

    const requests: Promise<any>[] = forms
        .map(form => {
          return ({
            groupId: this.group && this.group.id,
            day: this.day,
            week: this.week,
            ...form.getEntry()
          }) as TimetableEntryDTO;
        })
        .map(dto => {
          return dto.id === undefined
              ? api.timetable.create(dto)
              : api.timetable.update(dto.id, dto)
        });
    // check if any lessons were deleted
    const lessonsToRemove = this.loadedTimetable[this.week][this.day]
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

  createEntry(): TimetableEntryDTO | null {
    if (this.group !== null) {
      return {
        cabinetId: 0,
        day: Day.Monday,
        groupId: this.group?.id || 0,
        index: 0,
        lessonId: 0,
        teacherIds: [],
        type: TimetableEntryType.Lecture,
        week: Week.Top
      }
    }
    return null;
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
            this.timetable = [
              [
                [], [], [], [], [], [],
              ],
              [
                [], [], [], [], [], [],
              ],
            ];
          } else {
            const days: TimetableEntry[][] = [
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
            const timetable = days.map(day => {
              day.sort((a, b) => a.index - b.index);
              /**
               * Go through entries array and fill in null values if indices do not match.
               */
              const filledEntries = [];
              let lessonIndex = 0, entryIndex = 0;
              while (entryIndex < day.length) {
                // this entry is not in its place, so there should be null
                if (day[entryIndex].index !== lessonIndex) {
                  filledEntries.push(null);
                } else {
                  filledEntries.push(day[entryIndex]);
                  entryIndex++;
                }
                lessonIndex++;
              }
              return filledEntries as (TimetableEntry | null)[];
            });
            this.loadedTimetable[this.week] = days;
            this.timetable[this.week] = timetable;
            this.updateCurrentDay();
            this.loading = false;
          }
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
