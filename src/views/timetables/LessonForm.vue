<template>
  <Card v-if="isReady">
    <template slot="header">
      Пара {{lesson.index + 1}}
      <Button theme="danger" @click.native="$emit('remove', index)">Убрать пару</Button>
    </template>

    <Form ref="form" @submit="saveLesson">
      <Field name="subjectId" label="Предмет">
        <template v-slot:input="{updateValue}">
          <ListBox :default-value="data.subjectId" @select="updateValue" :options="lessonsOptions"></ListBox>
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
      <Alert theme="danger" v-if="!data.teacherIds">ALARM</Alert>
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
  </Card>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator';
import {CreateLessonDto, Day, Lesson, LessonType, UpdateLessonDto, Week} from 'ggtu-timetable-api-client';
import Form from '../../components/forms/Form.vue';
import Field from '../../components/forms/Field.vue';
import Select from '../../components/forms/Select.vue';
import ListBox from '@/components/forms/ListBox.vue';
import DayPicker from '@/components/timetable/DayPicker.vue';
import Button from '@/components/common/Button.vue';
import WeekPicker from '@/components/timetable/WeekPicker.vue';
import {LessonHolder} from '@/utils/timetables';
import TimetableFormFragment from '@/mixins/TimetableFormFragment';
import {namespace} from "vuex-class";
import {EditorState} from "@/store/editor/types";
import Card from "@/components/common/Card.vue";

const editor = namespace('editor');

@Component({
  name: 'LessonForm',
  components: {Form, Field, Select, ListBox, DayPicker, WeekPicker, Button, Card}
})
export default class LessonForm extends TimetableFormFragment<Lesson, CreateLessonDto> implements LessonHolder {

  @editor.State(state => state) editor!: EditorState;

  getLesson(): CreateLessonDto | UpdateLessonDto {
    const data = this.form.getFormData();
    return {
      day: this.editor.day,
      groupId: this.editor.groupId,
      week: this.editor.week,
      cabinetId: data.cabinetId,
      subjectId: data.subjectId,
      teacherIds: Array.isArray(data.teacherIds) ? data.teacherIds : [data.teacherIds],
      type: data.type,
      index: this.lesson?.index || 0,
      id: this.lesson?.id
    };
  }

  protected createEntryDto(entry: Lesson): CreateLessonDto {
    return {
      cabinetId: entry.cabinetId || 0,
      groupId: entry.groupId || 0,
      index: entry.index || 0,
      subjectId: entry.subjectId || 0,
      teacherIds: entry.teachers.map(teacher => teacher.id) || [],
      type: entry.type || LessonType.Lecture,
      week: entry.week || Week.Top,
      day: entry.day || Day.Monday,
    }
  }
}
</script>

<style scoped lang="sass">
.button_theme-danger
  font-size: 1rem
  float: right
</style>
