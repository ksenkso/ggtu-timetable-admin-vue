<template>
  <Page :title="title">
    <Form v-if="model" send-button-text="Сохранить" @submit="onSubmit">
      <Field label="Название" name="name" :initial-value="model.name"></Field>
    </Form>
  </Page>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Page from "./Page.vue";
import {NavigationGuardNext, Route} from "vue-router";
import {Group, WithId} from "ggtu-timetable-api-client";
import {api} from "@/api";
import Field from "@/components/forms/Field.vue";
import Form from "@/components/forms/Form.vue";
import {CREATE_ENTITY, UPDATE_ENTITY} from "@/store/entities/action-types";
import {namespace} from "vuex-class";

const groups = namespace('groups');
Component.registerHooks([
    'beforeRouteEnter'
]);

@Component({
  name: 'GroupView',
  components: {Page, Form, Field}
})
export default class GroupView extends Vue {
  model: Group | null = null;
  isLoading = false;
  @groups.Action(UPDATE_ENTITY) update!: (group: WithId<Group>) => Promise<void>;
  @groups.Action(CREATE_ENTITY) create!: (group: Group) => Promise<void>;

  get title(): string {
    return this.$route.params.id ? 'Редактирование группы' : 'Добавление группы';
  }

  onSubmit({name}: {name: string}) {
    let request;
    if (this.model?.id) {
      request = this.update({name, id: this.model.id});
    } else {
      request = this.create({name});
    }

    request.then(() => {
      this.$router.push('/groups');
    })
  }

  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    next((vm: Vue) => {
      if (!to.params.id) {
        next('/groups');
      } else {
        api.groups.get(+to.params.id)
            .then((group) => {
              (vm as GroupView).model = group;
              next();
            });
      }
    })

  }
}
</script>

<style lang="sass">
.form__buttons
  display: flex
  justify-content: flex-end
</style>
