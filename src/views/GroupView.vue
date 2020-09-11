<template>
  <Page :title="title">
    <Form v-if="model" send-button-text="Сохранить" @submit="onSubmit">
      <Field label="Название" name="name" :initial-value="model.name"></Field>
    </Form>
  </Page>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import Page from "./Page.vue";
import {Group, Teacher, WithId} from "ggtu-timetable-api-client";
import {api} from "@/api";
import Field from "@/components/forms/Field.vue";
import Form from "@/components/forms/Form.vue";
import {CREATE_ENTITY, UPDATE_ENTITY} from "@/store/entities/action-types";
import {namespace} from "vuex-class";
import EntityView from "@/mixins/EntityView";

const groups = namespace('groups');

@Component({
  name: 'GroupView',
  components: {Page, Form, Field}
})
export default class GroupView extends EntityView<Group> {
  redirectRoute = '/groups';
  isLoading = false;
  @groups.Action(UPDATE_ENTITY) update!: (group: WithId<Group>) => Promise<void>;
  @groups.Action(CREATE_ENTITY) create!: (group: Group) => Promise<void>;

  get title(): string {
    return this.$route.params.id ? 'Редактирование группы' : 'Добавление группы';
  }

  getEntity = (id: number): Promise<Teacher> => {
    return api.groups.get(id);
  }

}
</script>

<style>

</style>
