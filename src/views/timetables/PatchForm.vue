<template>
  <div class="timetable-form__fragment timetable-form__fragment_patch" v-if="isReady">
    <Form ref="form" no-submit-button>
      <div class="timetable-form__fields">
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
        <Field name="index" label="Номер пары" type="number" :initial-value="`${data.index + 1}`">
          <template v-slot:input="{updateValue, value}">
            <input :value="value" type="number" class="form__control" @change="updateValue($event.target.value)" min="1"
                   max="6">
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
      </div>
      <div class="timetable-form__dates">
        <!-- use div here because label will not provide any accessibility for ALL inputs and will cause errors in DOM-->
        <div class="form__label">Даты</div>
        <div class="date" v-for="(date, dateIndex) in data.dates" :key="dateIndex">
          <Field name="dates" label="Даты" type="date" :initial-value="date">
            <template slot="label">{{ '' }}</template>
          </Field>
          <Button :disabled="!canDeleteDate" theme="danger" @click.native="removeDate(date)">Удалить</Button>
        </div>
        <Button theme="primary" class="button_block" @click.native="addDate">Добавить дату</Button>
      </div>
    </Form>
    <div class="timetable-form__buttons">
      <Button theme="success" @click.native="saveLesson">Сохранить</Button>
      <Button theme="danger" @click.native="$emit('remove', index)">Удалить изменение</Button>
    </div>
  </div>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator';
import {CreatePatchDto, LessonType, Patch, UpdatePatchDto} from 'ggtu-timetable-api-client';
import Form from '../../components/forms/Form.vue';
import Field from '../../components/forms/Field.vue';
import Select from '../../components/forms/Select.vue';
import ListBox from '@/components/forms/ListBox.vue';
import DayPicker from '@/components/timetable/DayPicker.vue';
import Button from '@/components/common/Button.vue';
import WeekPicker from '@/components/timetable/WeekPicker.vue';
import {LessonHolder} from '@/utils/timetables';
import TimetableFormFragment from '@/mixins/TimetableFormFragment';
import {namespace} from 'vuex-class';
import {EditorState} from '@/store/editor/types';
import {ADD_PATCH, UPDATE_PATCH} from '@/store/editor/action-types';

const editor = namespace('editor');
@Component({
  name: 'PatchForm',
  components: { Form, Field, Select, ListBox, DayPicker, WeekPicker, Button }
})
export default class PatchForm extends TimetableFormFragment<Patch, CreatePatchDto> implements LessonHolder {

  data!: CreatePatchDto;

  @editor.State(state => state) editor!: EditorState;
  @editor.Action(UPDATE_PATCH) updatePatch!: (patch: UpdatePatchDto) => Promise<void>;
  @editor.Action(ADD_PATCH) addPatch!: (patch: CreatePatchDto) => Promise<void>;

  get canDeleteDate() {
    return (this.data.dates as string[]).length > 1;
  }

  protected createEntryDto(entry: Patch = {} as Patch): CreatePatchDto {
    console.log('lesson: ', entry.groupId);
    return {
      cabinetId: entry.cabinetId || 0,
      groupId: entry.groupId || 0,
      index: entry.index || 0,
      subjectId: entry.subjectId || 0,
      teacherIds: (entry.teachers || []).map(teacher => teacher.id),
      type: entry.type || LessonType.Lecture,
      dates: entry.dates || [new Date().toISOString()],
    };
  }

  getLesson(): CreatePatchDto | UpdatePatchDto {
    const data = this.form.getFormData();
    const lesson = {
      groupId: this.editor.groupId,
      cabinetId: data.cabinetId,
      subjectId: data.subjectId,
      teacherIds: Array.isArray(data.teacherIds) ? data.teacherIds : [data.teacherIds],
      type: data.type,
      index: data.index - 1,
      dates: Array.isArray(data.dates) ? data.dates.map((date: string) => new Date(date).toISOString()) : [new Date(data.dates).toISOString()],
    };
    if (this.lesson) {
      (lesson as UpdatePatchDto).id = this.lesson.id;
      return lesson as UpdatePatchDto;
    } else {
      return lesson as CreatePatchDto;
    }
  }

  addDate() {
    (this.data.dates as string[]).push((new Date()).toISOString());
  }

  removeDate(date: string) {
    if (this.canDeleteDate) {
      const dateIndex = (this.data.dates as string[]).findIndex(d => d === date);
      (this.data.dates as string[]).splice(dateIndex, 1);
    }
  }


}
</script>

<style lang="sass">
.timetable-form
  &__fragment
    padding: 1rem
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .13)
    margin-bottom: 2rem

    &_patch .form__fields
      display: flex
      column-gap: 1rem

  &__fields
    flex-basis: 60%

  &__dates
    display: flex
    flex-direction: column
    flex-basis: 40%

  &__buttons
    margin-left: auto
    width: calc(40% - .4rem)
    // as close as i could do
    display: flex
    column-gap: 1rem

    > *
      flex-grow: 1

.date
  margin-bottom: .5rem
  display: flex
  column-gap: .5rem

  .form__field
    margin-bottom: 0

  input
    padding: 6px 12px
    max-height: 39px
    flex-grow: 1
</style>
