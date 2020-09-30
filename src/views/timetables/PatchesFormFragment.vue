<template>
  <div class="timetable-form__fragment timetable-form__fragment_patch" v-if="data">
    <Form ref="form" no-submit-button>
      <div class="timetable-form__fields">
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
      <Button theme="success" @click.native="save">Сохранить</Button>
      <Button theme="danger" @click.native="$emit('remove', index)">Удалить изменение</Button>
    </div>
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
import { api } from '@/api';
import { Prop } from 'vue-property-decorator';

@Component({
  name: 'PatchesFormFragment',
  components: { Form, Field, Select, ListBox, DayPicker, WeekPicker, Button }
})
export default class PatchesFormFragment extends TimetableFormFragment<TimetablePatch, TimetablePatchDTO> implements TimetableEntryHolder<TimetablePatchForm> {

  @Prop({ required: true }) groupId!: number;

  get canDeleteDate() {
    return this.data && this.data.dates.length > 1;
  }

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
      dates: this.entry.dates.slice(0)
    };
  }

  getTimetableEntry(): TimetablePatchForm {
    const data = this.form.getFormData();
    return {
      id: this.entry.id as number,
      cabinetId: data.cabinetId,
      lessonId: data.lessonId,
      teacherIds: Array.isArray(data.teacherIds) ? data.teacherIds : [data.teacherIds],
      type: data.type,
      index: data.index - 1,
      dates: data.dates,
    };
  }

  addDate() {
    if (this.data) {
      const dateString = (new Date()).toISOString().substring(0, 10);
      console.log(dateString)
      this.data.dates.push(dateString);
    }
  }

  removeDate(date: string) {
    if (this.data && this.canDeleteDate) {
      const dateIndex = this.data.dates.findIndex(d => d === date);
      this.data.dates.splice(dateIndex, 1);
    }
  }

  save() {
    const entry = this.getTimetableEntry();
    let request: Promise<any>;
    if (entry.id < 1) {
      request = api.patches.create({ ...entry, groupId: this.groupId })
    } else {
      request = api.patches.update(entry.id, entry);
    }
    request.then(() => {
      alert('SUCCESS');
      location.reload();
    });
  }


}
</script>

<style lang="sass">
.timetable-form
  &__fragment
    padding: 1rem
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .13)
    margin-bottom: 2rem

    &_patch

      .form__fields
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
