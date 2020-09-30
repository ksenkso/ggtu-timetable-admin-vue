<template>
  <div class="timetable-form__fragment" v-if="data">
    <Button theme="danger" @click.native="$emit('remove', index)">Убрать пару</Button>
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
      <slot></slot>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { TimetableEntry, TimetableEntryDTO } from 'ggtu-timetable-api-client';
import Form from '../../components/forms/Form.vue';
import Field from '../../components/forms/Field.vue';
import Select from '../../components/forms/Select.vue';
import ListBox from '@/components/forms/ListBox.vue';
import DayPicker from '@/components/timetable/DayPicker.vue';
import Button from '@/components/common/Button.vue';
import WeekPicker from '@/components/timetable/WeekPicker.vue';
import { TimetableEntryForm } from '@/store/entities/types';
import { TimetableEntryHolder } from '@/utils/timetables';
import TimetableFormFragment from '@/mixins/TimetableFormFragment';

/*
const cabinets = namespace('cabinets');
const teachers = namespace('teachers');
const lessons = namespace('lessons');
*/

@Component({
  name: 'RegularEntryForm',
  components: { Form, Field, Select, ListBox, DayPicker, WeekPicker, Button }
})
export default class RegularEntryForm extends TimetableFormFragment<TimetableEntry, TimetableEntryDTO> implements TimetableEntryHolder<TimetableEntryForm> {

  /*@Prop({ required: true }) entry!: TimetableEntry | TimetableEntryDTO;
  @Prop({ required: true }) index!: number;
  @cabinets.Action(GET_ALL_ENTITIES) getCabinets!: () => Promise<void>;
  @teachers.Action(GET_ALL_ENTITIES) getTeachers!: () => Promise<void>;
  @lessons.Action(GET_ALL_ENTITIES) getLessons!: () => Promise<void>;
  @cabinets.State('entities') cabinets!: Dictionary<Cabinet>;
  @teachers.State('entities') teachers!: NamedEntityDict;
  @lessons.State('entities') lessons!: NamedEntityDict;
  @cabinets.State('isLoaded') cabinetsLoaded!: boolean;
  @teachers.State('isLoaded') teachersLoaded!: boolean;
  @lessons.State('isLoaded') lessonsLoaded!: boolean;

  get optionsLoaded(): boolean {
    return this.cabinetsLoaded && this.teachersLoaded && this.lessonsLoaded;
  }

  @Ref() form!: Form;
  data: TimetableEntryDTO | null = null;
  lessonsOptions: SelectOption[] = [];
  teachersOptions: SelectOption[] = [];
  cabinetsOptions: SelectOption[] = [];
  entryTypes: SelectOption[] = [
    { value: 0, name: 'Лекция' },
    { value: 1, name: 'Практическое занятие' },
    { value: 2, name: 'Лабораторная работа' },
  ];
  teachersCount = 1;
  private teacherIds?: number[] | null = null;

  addTeacherField() {
    this.teachersCount++;
  }*/

  getTimetableEntry(): TimetableEntryForm {
    const data = this.form.getFormData();
    return {
      id: this.entry.id as number,
      cabinetId: data.cabinetId,
      lessonId: data.lessonId,
      teacherIds: Array.isArray(data.teacherIds) ? data.teacherIds : [data.teacherIds],
      type: data.type,
      index: this.index,
    };
  }

  /*mounted() {
    this.data = this.createEntryDto(this.entry);
    this.teachersCount = Math.max(this.data.teacherIds.length, 1);
    let loadEntities: Promise<any>;
    if (!this.optionsLoaded) {
      loadEntities = Promise.all([
        this.getCabinets(),
        this.getLessons(),
        this.getTeachers()
      ]);
    } else {
      loadEntities = Promise.resolve();
    }
    loadEntities.then(() => {
      this.lessonsOptions = defaultEntityAdapter(Object.keys(this.lessons)
          .map((id) => this.lessons[id] as NamedEntity));
      this.teachersOptions = defaultEntityAdapter(Object.keys(this.teachers)
          .map((id) => this.teachers[id] as NamedEntity));
      this.cabinetsOptions = cabinetsAdapter(Object.keys(this.cabinets)
          .map((id) => this.cabinets[id] as Cabinet));
    })

  }*/

  protected createEntryDto(entry: TimetableEntry | TimetableEntryDTO): TimetableEntryDTO {
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
