<template>
  <Page :title="title">
    <WeekPicker :default-week="week" @change="setWeek"></WeekPicker>
    <DayPicker :default-day="day" @change="setDay"></DayPicker>
    <div class="fragments" v-if="loaded">
      <div class="lesson" v-for="(entry, index) in entries" :key="index">
        <h3>Пара {{ index + 1 }}</h3>
        <component :is="componentForEntry(entry)" ref="forms" :entry="entry"></component>
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
  Week, WithId
} from "ggtu-timetable-api-client";
import {NavigationGuardNext, Route} from "vue-router";
import {api} from "@/api";
import TimetableFormFragment from "@/views/timetables/TimetableFormFragment.vue";
import Button from "@/components/common/Button.vue";
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
  components: {Page, TimetableFormFragment, Button, WeekPicker, DayPicker, MockLesson}
})
export default class TimetableForm extends Vue {

  @cabinets.State('entities') cabinets!: Dictionary<Cabinet>;
  @teachers.State('entities') teachers!: NamedEntityDict;
  @lessons.State('entities') lessons!: NamedEntityDict;

  @cabinets.Action(GET_ALL_ENTITIES) getCabinets!: () => Promise<void>;
  @teachers.Action(GET_ALL_ENTITIES) getTeachers!: () => Promise<void>;
  @lessons.Action(GET_ALL_ENTITIES) getLessons!: () => Promise<void>;

  @Ref() forms!: TimetableFormFragment[];

  group: WithId<Group> | null = null;
  entries: (TimetableEntry | TimetableEntryDTO | null)[] | null = null;
  day = 0;
  week = 0;
  entitiesLoaded = false;

  get title() {
    return this.group ? `Расписание: ${this.group.name}` : 'Загрузка...';
  }

  get loaded() {
    return this.group && this.entries && this.entitiesLoaded;
  }

  componentForEntry(entry: TimetableEntry | TimetableEntryDTO | null): string {
    return entry === null ? 'MockLesson' : 'TimetableFormFragment';
  }

  setDay(day: ButtonGroupValue) {
    this.day = day.value;
  }

  setWeek(week: ButtonGroupValue) {
    this.week = week.value;
  }

  addForm() {
    if (!this.entries) {
      this.entries = [this.createEntry()]
    } else {
      this.entries.push(this.createEntry());
    }
  }

  submitTimetable() {
    const requests = this.forms
        .map((form, index) => ({
          groupId: this.group && this.group.id,
          index, // TODO: add form mockups so that blank lessons are possible, re-index lessons
          day: this.day,
          week: this.week,
          ...form.getEntry()
        }) as TimetableEntryDTO)
        .map(dto => {
          return dto.id === undefined
              ? api.timetable.create(dto)
              : api.timetable.update(dto.id, dto)
        });
    Promise.all(requests)
        .then(() => {
          alert('SUCCESS');
          location.reload();
        })

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

  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    if (!to.params.groupId) {
      next('/groups');
    } else {
      next((vm: Vue) => {
        const $this = vm as TimetableForm;
        api.groups.get(+to.params.groupId)
            .then(group => {
              $this.group = group;
              api.timetable.getForGroup(group.id)
                  .then(entries => {
                    if (!entries.length) {
                      $this.entries = [
                        $this.createEntry(),
                      ];
                    } else {
                      const filledEntries = [];
                      let i = 0, j = 0;
                      while (j < entries.length) {
                        if (entries[j].index !== i) {
                          filledEntries.push(null);
                        } else {
                          filledEntries.push(entries[j]);
                          j++;
                        }
                        i++;
                      }
                      $this.entries = filledEntries;
                    }
                  })
            })
      })
    }
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
