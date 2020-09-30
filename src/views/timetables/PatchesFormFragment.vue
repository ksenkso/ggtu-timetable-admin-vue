<template>
  <div class="timetable-form__fragment" v-if="data">
    <Button theme="danger" @click.native="$emit('remove', index)">Удалить изменение</Button>
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
import { TimetablePatch } from 'ggtu-timetable-api-client';
import { TimetablePatchDTO } from 'ggtu-timetable-api-client';
import Form from '../../components/forms/Form.vue';
import Field from '../../components/forms/Field.vue';
import Select from '../../components/forms/Select.vue';
import ListBox from '@/components/forms/ListBox.vue';
import DayPicker from '@/components/timetable/DayPicker.vue';
import Button from '@/components/common/Button.vue';
import WeekPicker from '@/components/timetable/WeekPicker.vue';
import { TimetablePatchForm } from '@/store/entities/types';
import { TimetableEntryHolder } from '@/utils/timetables';
import TimetableFormFragment from '@/mixins/TimetableFormFragment';
/*
const cabinets = namespace('cabinets');
const teachers = namespace('teachers');
const lessons = namespace('lessons');*/

@Component({
  name: 'TimetableFormFragment',
  components: { Form, Field, Select, ListBox, DayPicker, WeekPicker, Button }
})
export default class PatchesFormFragment extends TimetableFormFragment<TimetablePatch, TimetablePatchDTO> implements TimetableEntryHolder<TimetablePatchForm> {
  /*
    @Prop({ required: true }) entry!: TimetablePatch | TimetablePatchDTO;
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
    data: TimetablePatchDTO | null = null;
    lessonsOptions: SelectOption[] = [];
    teachersOptions: SelectOption[] = [];
    cabinetsOptions: SelectOption[] = [];
    entryTypes: SelectOption[] = [
      { value: 0, name: 'Лекция' },
      { value: 1, name: 'Практическое занятие' },
      { value: 2, name: 'Лабораторная работа' },
    ];
    teachersCount = 1;*/

  getTimetableEntry(): TimetablePatchForm {
    const data = this.form.getFormData();
    return {
      id: this.entry.id as number,
      cabinetId: data.cabinetId,
      lessonId: data.lessonId,
      teacherIds: Array.isArray(data.teacherIds) ? data.teacherIds : [data.teacherIds],
      type: data.type,
      index: this.index,
      dates: []
    };
  }

  /*addTeacherField() {
    this.teachersCount++;
  }


  mounted() {
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

  protected createEntryDto(entry: TimetablePatch | TimetablePatchDTO): TimetablePatchDTO {
    const teacherIds = (this.entry as TimetablePatch).teachers
        ? (this.entry as TimetablePatch).teachers.map(teacher => teacher.id as number)
        : (this.entry as TimetablePatchDTO).teacherIds;
    return {
      cabinetId: entry.cabinetId,
      groupId: entry.groupId,
      index: entry.index,
      lessonId: entry.lessonId,
      teacherIds,
      type: entry.type,
      dates: []
    };
  }
}
</script>

<style scoped>

</style>
