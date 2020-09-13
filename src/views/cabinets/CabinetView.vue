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
import {Cabinet, WithId} from "ggtu-timetable-api-client";
import Form from "@/components/forms/Form.vue";
import Field from "@/components/forms/Field.vue";
import {namespace} from "vuex-class";
import entityView from "@/mixins/EntityView";
import {api} from "@/api";

const cabinets = namespace('cabinets');

@Component({
  name: 'BuildingView',
  components: {Page, Form, Field}
})
export default class BuildingView extends entityView(cabinets) {
  redirectRoute = '/cabinets';

  get title(): string {
    return this.$route.params.id ? 'Редактирование здания' : 'Добавление здания';
  }

  getEntity = (id: number): Promise<WithId<Cabinet>> => {
    return api.cabinets.get(id);
  }

}
</script>

<style scoped>

</style>
