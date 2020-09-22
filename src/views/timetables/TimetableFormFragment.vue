<template>
  <div class="timetable-form__fragment">
    <Form @submit="onFormSubmit">
      <WeekPicker :default-week="0" @change="setWeek"></WeekPicker>
      <DayPicker :default-day="0" @change="setDay"></DayPicker>
      <Field name="lessonId" label="Предмет">
        <template v-slot:input="{updateValue}">
          <ListBox @select="updateValue" :options="lessons"></ListBox>
        </template>
      </Field>
      <Field name="entryType" label="Тип занятия">
        <template v-slot:input="{updateValue}">
          <Select
              :initial-value="0"
              @change="updateValue"
              name="entryType"
              :options="entryTypes">
          </Select>
        </template>
      </Field>
      <Field name="teacherId" label="Преподаватель">
        <template v-slot:input="{updateValue}">
          <ListBox @select="updateValue" :options="teachers"></ListBox>
        </template>
      </Field>
      <Field v-for="t in additionalTeachers" :key="t" name="teacherId" label="Преподаватель">
        <template v-slot:input="{updateValue}">
          <ListBox @select="updateValue" :options="teachers"></ListBox>
        </template>
      </Field>
      <Button @click.native="addTeacherField" theme="primary">Добавить преподавателя</Button>
      <Field name="cabinetId" label="Кабинет">
        <template v-slot:input="{updateValue}">
          <ListBox @select="updateValue" :options="cabinets"></ListBox>
        </template>
      </Field>
    </Form>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {EntityType, Group, TimetableEntry, WithId} from "ggtu-timetable-api-client";
import {api} from "@/api";
import Form from "../../components/forms/Form.vue";
import Field from "../../components/forms/Field.vue";
import Select from "../../components/forms/Select.vue";
import ListBox from "@/components/forms/ListBox.vue";
import {cabinetsAdapter, defaultEntityAdapter, SelectOption} from "@/utils/lists";
import DayPicker from "@/components/timetable/DayPicker.vue";
import Button from "@/components/common/Button.vue";
import WeekPicker from "@/components/timetable/WeekPicker.vue";


@Component({
  name: 'TimetableFormFragment',
  components: {Form, Field, Select, ListBox, DayPicker, WeekPicker, Button}
})
export default class TimetableFormFragment extends Vue {

  @Prop({required: true}) group!: WithId<Group>;
  entries: TimetableEntry[] = [];
  lessons: SelectOption[] = [];
  teachers: SelectOption[] = [];
  cabinets: SelectOption[] = [];
  buildings: SelectOption[] = [];
  day = 0;
  days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  weeks = ['Верхняя', 'Нижняя'];
  additionalTeachers = 0;
  entryTypes: SelectOption[] = [
    {value: 0, name: 'Лекция'},
    {value: 1, name: 'Практическое занятие'},
    {value: 2, name: 'Лабораторная работа'},
  ];
  isLoading = false;

  onFormSubmit(data) {
    console.log(data);
  }

  setDay(day) {
    this.day = day.value;
  }

  setWeek(week) {
    this.week = week.value;
  }

  addTeacherField() {
    this.additionalTeachers++;
  }

  mounted() {
    const modelTypes = [EntityType.Lesson, EntityType.Teacher];
    api.timetable.getForGroup(this.group.id)
        .then(entries => {
          this.entries = entries;
        });
    this.isLoading = true;
    // load lessons and teachers
    const requests = modelTypes.map((type) => {
      return api.getEndpoint(type).getAll()
          .then(defaultEntityAdapter);
    });
    // load cabinets with a different adapter
    requests.push(api.cabinets.getAll({entities: ['buildings']}).then(cabinetsAdapter))
    Promise.all(requests)
        .then(([lessons, teachers, cabinets]) => {
          this.lessons = lessons;
          this.teachers = teachers;
          this.cabinets = cabinets;
          this.isLoading = false;
        });
  }
}
</script>

<style scoped>

</style>
