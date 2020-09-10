<template>
  <Page :title="title">
    <Form :is-loading="isLoading" v-if="model" send-button-text="Сохранить" @submit="onSubmit">
      <Field label="ФИО" name="name" :initial-value="model.name"></Field>
    </Form>
  </Page>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Page from "./Page.vue";
import {NavigationGuardNext, Route} from "vue-router";
import {Teacher, WithId} from "ggtu-timetable-api-client";
import {api} from "@/api";
import Form from "@/components/forms/Form.vue";
import Field from "@/components/forms/Field.vue";
import Button from "@/components/common/Button.vue";
import {namespace} from "vuex-class";
import {CREATE_ENTITY, UPDATE_ENTITY} from "@/store/entities/action-types";

Component.registerHooks([
    'beforeRouteEnter',
    'beforeRouteUpdate'
])

const teachers = namespace('teachers');

@Component({
  name: 'TeacherView',
  components: {Page, Form, Field, Button}
})
export default class TeacherView extends Vue {
  model: Teacher | null = null;
  isLoading = false;

  @teachers.Action(UPDATE_ENTITY) update!: (teacher: WithId<Teacher>) => Promise<void>;
  @teachers.Action(CREATE_ENTITY) create!: (teacher: Teacher) => Promise<void>;

  get title(): string {
    return this.$route.params.id ? 'Редактирование преподавателя' : 'Добавление преподавателя';
  }

  onSubmit({name}: {name: string}) {
    let request;
    if (this.model?.id) {
      request = this.update({name, id: this.model.id});
    } else {
      request = this.create({name});
    }

    request.then(() => {
      this.$router.push('/teachers');
    })
  }

  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    next((vm: Vue) => {
      if (to.params.id) {
        console.log(to.params.id);
        (vm as TeacherView).isLoading = true;
        api.teachers.get(+to.params.id)
            .then((teacher) => {
              (vm as TeacherView).model = teacher;
              (vm as TeacherView).isLoading = false;
              next();
            });
      } else {
        (vm as TeacherView).model = {name: ''};
      }
    })
  }
}
</script>

<style scoped>

</style>
