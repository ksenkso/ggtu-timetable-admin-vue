<template>
  <div class="timetable-form__fragment" v-if="data">
    <Button theme="danger" @click.native="$emit('remove', index)">Убрать пару</Button>
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
import {Component, Prop} from 'vue-property-decorator';
import {CreateLessonDto, UpdateLessonDto} from 'ggtu-timetable-api-client';
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
import {api} from "@/api";

const editor = namespace('editor');
@Component({
  name: 'RegularEntryForm',
  components: {Form, Field, Select, ListBox, DayPicker, WeekPicker, Button}
})
export default class RegularEntryForm extends TimetableFormFragment<UpdateLessonDto, CreateLessonDto> implements LessonHolder {
  /**
   * use this prop to provide index for the entry from the outside (TimetableForm)
   * @see RegularEntryForm#getLesson
   */
  @Prop({required: true}) index!: number;
  @editor.State(state => state) editor!: EditorState;

  getLesson(): CreateLessonDto {
    const data = this.form.getFormData();
    return {
      day: this.editor.day,
      groupId: this.editor.groupId,
      week: this.editor.week,
      // id: this.entry.id as number,
      cabinetId: data.cabinetId,
      subjectId: data.subjectId,
      teacherIds: Array.isArray(data.teacherIds) ? data.teacherIds : [data.teacherIds],
      type: data.type,
      index: this.index
    };
  }

  saveLesson() {
    const lesson = this.getLesson();
    if ((this.data as UpdateLessonDto).id) {
      return api.timetable.update((this.data as UpdateLessonDto).id as number, this.data as UpdateLessonDto)
    }
    return api.timetable.create(lesson)
        .then(created => {
          // update id to prevent creating the same lesson multiple times
          (this.data as UpdateLessonDto).id = created.id;
        });
  }

  protected createEntryDto(entry: UpdateLessonDto): UpdateLessonDto {
    return {
      cabinetId: entry.cabinetId,
      day: entry.day,
      groupId: entry.groupId,
      index: entry.index,
      subjectId: entry.subjectId,
      teacherIds: entry.teacherIds,
      type: entry.type,
      week: entry.week,
      id: entry.id,
    }
  }
}
</script>

<style scoped>

</style>
