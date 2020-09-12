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
import {Teacher} from "ggtu-timetable-api-client";
import {api} from "@/api";
import Field from "@/components/forms/Field.vue";
import Form from "@/components/forms/Form.vue";
import {namespace} from "vuex-class";
import entityView from "@/mixins/EntityView";

const lessons = namespace('lessons');

@Component({
  name: 'GroupView',
  components: {Page, Form, Field}
})
export default class LessonView extends entityView(lessons) {
  redirectRoute = '/lessons';
  isLoading = false;

  get title(): string {
    return this.$route.params.id ? 'Редактирование группы' : 'Добавление группы';
  }

  getEntity = (id: number): Promise<Teacher> => {
    return api.groups.get(id);
  }

}
</script>

<style lang="sass">
.form__buttons
  display: flex
  justify-content: flex-end
</style>
