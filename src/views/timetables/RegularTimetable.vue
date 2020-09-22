<template>
  <Page title="Раписание">

  </Page>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Page from "../Page.vue";
import {NavigationGuardNext, Route} from "vue-router";
import {api} from "@/api";
import {TimetableEntry} from "ggtu-timetable-api-client";
import TimetableForm from "@/views/timetables/TimetableForm.vue";

Component.registerHooks([
    'beforeRouteEnter',
]);

@Component({
  name: 'RegularTimetable',
  components: {Page, TimetableForm}
})
export default class RegularTimetable extends Vue {

  entries: TimetableEntry[] = [];

  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    if (!to.params.groupId) {
      next('/');
    } else {
      next((vm: Vue) => {
        api.timetable.getForGroup(+to.params.groupId)
          .then(entries => {
            (vm as RegularTimetable).entries = entries;
          })
      })
    }
  }
}
</script>

<style scoped>

</style>
