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
import { Prop } from 'vue-property-decorator';

@Component({
  name: 'RegularEntryForm',
  components: { Form, Field, Select, ListBox, DayPicker, WeekPicker, Button }
})
export default class RegularEntryForm extends TimetableFormFragment<TimetableEntry, TimetableEntryDTO> implements TimetableEntryHolder<TimetableEntryForm> {
  /**
   * use this prop to provide index for the entry from the outside (TimetableForm)
   * @see RegularEntryForm#getTimetableEntry
   */
  @Prop({ required: true }) index!: number;

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
