<template>
  <div class="timetable-form__fragment">
    <Form @submit="onFormSubmit">
    <Field name="lessonId" label="Предмет">
      <template v-slot:input="{updateValue}">
        <ListBox @select="updateValue" :options="lessons"></ListBox>
      </template>
    </Field>
    <Field name="teacherId" label="Преподаватель">
      <template v-slot:input="{updateValue}">
        <ListBox @select="updateValue" :options="teachers"></ListBox>
      </template>
    </Field>
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
import {SelectOption} from "@/components/forms/Select.vue";
import {cabinetsAdapter, defaultEntityAdapter} from "@/utils/entityListAdapters";


@Component({
  name: 'TimetableFormFragment',
  components: {Form, Field, Select, ListBox}
})
export default class TimetableFormFragment extends Vue {

  @Prop({required: true}) group!: WithId<Group>;
  entries: TimetableEntry[] = [];
  lessons: SelectOption[] = [];
  teachers: SelectOption[] = [];
  cabinets: SelectOption[] = [];
  buildings: SelectOption[] = [];
  isLoading = false;

  onFormSubmit(data) {
    console.log(data);
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
