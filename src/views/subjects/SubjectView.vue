<template>
  <Page :title="title">
    <Alert theme="info" v-if="isLoading">Загрузка...</Alert>
    <Alert theme="danger" v-if="loaded && !model">Ошибка ((</Alert>
    <Form v-if="model" send-button-text="Сохранить" @submit="onSubmit">
      <Field label="Название" name="name" :initial-value="model.name"></Field>
    </Form>
  </Page>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import Page from "../Page.vue";
import {Subject, WithId} from "ggtu-timetable-api-client";
import {api} from "@/api";
import Field from "@/components/forms/Field.vue";
import Form from "@/components/forms/Form.vue";
import {namespace} from "vuex-class";
import entityView from "@/mixins/EntityView";

const subjects = namespace('subjects');

@Component({
  name: 'SubjectView',
  components: {Page, Form, Field}
})
export default class SubjectView extends entityView(subjects) {
  redirectRoute = '/subjects';
  get title(): string {
    return this.$route.params.id ? 'Редактирование предмета' : 'Добавление предмета';
  }

  getEntity = (id: number): Promise<WithId<Subject>> => {
    return api.subjects.get(id);
  }
}
</script>

<style lang="sass">
.form__buttons
  display: flex
  justify-content: flex-end
</style>
