<template>
  <Page></Page>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Page from "./Page.vue";
import {NavigationGuardNext, Route} from "vue-router";
import {Group} from "ggtu-timetable-api-client";
import {api} from "@/api";

@Component({
  name: 'GroupView',
  components: {Page}
})
export default class GroupView extends Vue {
  model?: Group;
  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    next((vm: Vue) => {
      if (!to.params.id) {
        next('/teachers');
      } else {
        api.teachers.get(+to.params.id)
            .then((teacher) => {
              (vm as GroupView).model = teacher;
              next();
            });
      }
    })

  }
}
</script>

<style scoped>

</style>
