<template>
  <Page :title="title">
    <Form v-if="model" send-button-text="Сохранить" @submit="onSubmit">
      <Field label="ФИО" name="name" :initial-value="model.name"></Field>
    </Form>
  </Page>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import Page from "./Page.vue";
import {Teacher, WithId} from "ggtu-timetable-api-client";
import Form from "@/components/forms/Form.vue";
import Field from "@/components/forms/Field.vue";
import Button from "@/components/common/Button.vue";
import {namespace} from "vuex-class";
import {CREATE_ENTITY, UPDATE_ENTITY} from "@/store/entities/action-types";
import EntityView from "@/mixins/EntityView";
import {api} from "@/api";

const teachers = namespace('teachers');

@Component({
  name: 'TeacherView',
  components: {Page, Form, Field, Button}
})
export default class TeacherView extends EntityView<Teacher> {
  redirectRoute = '/teachers';
  @teachers.Action(UPDATE_ENTITY) update!: (teacher: WithId<Teacher>) => Promise<void>;
  @teachers.Action(CREATE_ENTITY) create!: (teacher: Teacher) => Promise<void>;

  get title(): string {
    return this.$route.params.id ? 'Редактирование преподавателя' : 'Добавление преподавателя';
  }

  getEntity = (id: number): Promise<Teacher> => {
    return api.teachers.get(id);
  }

}
</script>

<style scoped>

</style>
