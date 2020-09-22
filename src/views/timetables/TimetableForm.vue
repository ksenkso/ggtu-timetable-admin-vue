<template>
  <Page :title="title">
    <div class="fragments" v-if="group">
      <TimetableFormFragment :group="group"></TimetableFormFragment>
    </div>

  </Page>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Page from "../Page.vue";
import {Group, TimetableEntry} from "ggtu-timetable-api-client";
import {NavigationGuardNext, Route} from "vue-router";
import {api} from "@/api";
import TimetableFormFragment from "@/views/timetables/TimetableFormFragment.vue";

Component.registerHooks([
    'beforeRouteEnter',
])

@Component({
  name: 'TimetableForm',
  components: {Page, TimetableFormFragment}
})
export default class TimetableForm extends Vue {

  group: Group | null = null;
  entries: TimetableEntry[] | null = null;
  get title() {
    return this.group ? `Расписание: ${this.group.name}` : 'Загрузка...';
  }

  get loaded() {
    return this.group && this.entries;
  }

  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    if (!to.params.groupId) {
      next('/groups');
    } else {
      next((vm: Vue) => {
        api.groups.get(+to.params.groupId)
          .then(group => {
            (vm as TimetableForm).group = group;
            api.timetable.getForGroup(group.id)
              .then(entries => {
                (vm as TimetableForm).entries = entries;
              })
          })
      })
    }
  }
}
</script>

<style scoped>

</style>
