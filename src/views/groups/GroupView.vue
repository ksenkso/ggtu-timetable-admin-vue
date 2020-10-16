<template>
  <Page :title="title">
    <Form v-if="model" send-button-text="Сохранить" @submit="onSubmit">
      <Field label="Название" name="name" :initial-value="model.name"></Field>
    </Form>
  </Page>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import Page from "../Page.vue";
import {Group, WithId} from "ggtu-timetable-api-client";
import {api} from "@/api";
import Field from "@/components/forms/Field.vue";
import Form from "@/components/forms/Form.vue";
import {namespace} from "vuex-class";
import entityView from "@/mixins/EntityView";

const groups = namespace('groups');

@Component({
  name: 'GroupView',
  components: {Page, Form, Field}
})
export default class GroupView extends entityView(groups) {
  redirectRoute = '/groups';
  isLoading = false;

  get title(): string {
    return this.$route.params.id ? 'Редактирование группы' : 'Добавление группы';
  }

  getEntity = (id: number): Promise<WithId<Group>> => {
    return api.groups.get(id);
  }

}
</script>

<style>

</style>
