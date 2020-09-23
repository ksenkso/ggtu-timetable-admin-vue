<template>
  <div class="timetable-form__fragment" v-if="data">
    <div class="mock-lesson">
      <Button @click.native="addEntry">Добавить</Button>
    </div>
    <Form ref="form" no-submit-button>
      <Field name="lessonId" label="Предмет">
        <template v-slot:input="{updateValue}">
          <ListBox :default-value="data.lessonId" @select="updateValue" :options="lessonsOptions"></ListBox>
        </template>
      </Field>
      <Field name="type" label="Тип занятия">
        <template v-slot:input="{updateValue}">
          <Select
              :initial-value="data.type"
              @change="updateValue"
              name="type"
              :options="entryTypes">
          </Select>
        </template>
      </Field>
      <Field v-for="index in teachersCount" :key="index" name="teacherIds" label="Преподаватель">
        <template v-slot:input="{updateValue}">
          <ListBox :default-value="data.teacherIds[index - 1]" @select="updateValue"
                   :options="teachersOptions"></ListBox>
        </template>
      </Field>
      <Button @click.native="addTeacherField" theme="primary">Добавить преподавателя</Button>
      <Field name="cabinetId" label="Кабинет">
        <template v-slot:input="{updateValue}">
          <ListBox :default-value="data.cabinetId" @select="updateValue" :options="cabinetsOptions"></ListBox>
        </template>
      </Field>
    </Form>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from 'vue-property-decorator';
import {Cabinet, TimetableEntry, TimetableEntryDTO} from "ggtu-timetable-api-client";
import Form from "../../components/forms/Form.vue";
import Field from "../../components/forms/Field.vue";
import Select from "../../components/forms/Select.vue";
import ListBox from "@/components/forms/ListBox.vue";
import {cabinetsAdapter, defaultEntityAdapter, SelectOption} from "@/utils/lists";
import DayPicker from "@/components/timetable/DayPicker.vue";
import Button from "@/components/common/Button.vue";
import WeekPicker from "@/components/timetable/WeekPicker.vue";
import {NamedEntity, NamedEntityDict, TimetableEntryForm} from "@/store/entities/types";
import {namespace} from "vuex-class";
import {Dictionary} from "vue-router/types/router";

const cabinets = namespace('cabinets');
const teachers = namespace('teachers');
const lessons = namespace('lessons');

@Component({
  name: 'TimetableFormFragment',
  components: {Form, Field, Select, ListBox, DayPicker, WeekPicker, Button}
})
export default class TimetableFormFragment extends Vue {

  @Prop({required: true}) entry!: TimetableEntry | TimetableEntryDTO | null;

  @cabinets.State('entities') cabinets!: Dictionary<Cabinet>;
  @teachers.State('entities') teachers!: NamedEntityDict;
  @lessons.State('entities') lessons!: NamedEntityDict;

  @Ref() form!: Form;
  data: TimetableEntryDTO | null = null;
  lessonsOptions: SelectOption[] = [];
  teachersOptions: SelectOption[] = [];
  cabinetsOptions: SelectOption[] = [];
  entryTypes: SelectOption[] = [
    {value: 0, name: 'Лекция'},
    {value: 1, name: 'Практическое занятие'},
    {value: 2, name: 'Лабораторная работа'},
  ];
  teachersCount = 1;
  private teacherIds?: number[] | null = null;

  addTeacherField() {
    this.teachersCount++;
  }

  getEntry(): TimetableEntryForm | null {
    if (this.entry === null) {
      return null;
    }
    const data = this.form.getFormData();
    return {
      id: this.entry.id,
      cabinetId: data.cabinetId,
      lessonId: data.lessonId,
      teacherIds: Array.isArray(data.teacherIds) ? data.teacherIds : [data.teacherIds],
      type: data.type,
    };
  }

  mounted() {
    if (this.entry !== null) {
      this.data = this.createEntryDto(this.entry);
      this.teachersCount = Math.max(this.data.teacherIds.length, 1);
      this.lessonsOptions = defaultEntityAdapter(Object.keys(this.lessons)
          .map((id) => this.lessons[id] as NamedEntity));
      this.teachersOptions = defaultEntityAdapter(Object.keys(this.teachers)
          .map((id) => this.teachers[id] as NamedEntity));
      this.cabinetsOptions = cabinetsAdapter(Object.keys(this.cabinets)
          .map((id) => this.cabinets[id] as Cabinet));
    }
  }

  private createEntryDto(entry: TimetableEntry | TimetableEntryDTO): TimetableEntryDTO {
    const teacherIds = (this.entry as TimetableEntry).teachers
        ? (this.entry as TimetableEntry).teachers.map(teacher => teacher.id as number)
        : (this.entry as TimetableEntryDTO).teacherIds;
    return {
      cabinetId: entry.cabinetId,
      day: entry.day,
      groupId: entry.groupId,
      index: entry.index,
      lessonId: entry.lessonId,
      teacherIds,
      type: entry.type,
      week: entry.week
    }
  }
}
</script>

<style scoped>

</style>
