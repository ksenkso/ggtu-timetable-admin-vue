<template>
  <Page title="Изменения в расписании">
    <div class="entry" v-for="entry in entries" :key="entry.id">
      <PatchesFormFragment :entry="entry" :index="entry.index"></PatchesFormFragment>
    </div>
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Page from '../Page.vue';
import { NavigationGuardNext, Route } from 'vue-router';
import { api } from '@/api';
import { TimetablePatch } from 'ggtu-timetable-api-client';
import PatchesFormFragment from '@/views/timetables/PatchesFormFragment.vue';

Component.registerHooks([
  'beforeRouteEnter',
]);

function patchesAdapter(patches: TimetablePatch[]): any {
  // patches.reduce((date))
  return patches;
}

@Component({
  name: 'RegularTimetable',
  components: { Page, PatchesFormFragment }
})
export default class PatchesForm extends Vue {

  entries: any = [];

  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    if (!to.params.groupId) {
      next('/');
    } else {
      next((vm: Vue) => {
        api.patches.getForGroup(+to.params.groupId)
            .then(patches => {
              (vm as PatchesForm).entries = patchesAdapter(patches);
            })
      })
    }
  }
}
</script>

<style scoped>

</style>
