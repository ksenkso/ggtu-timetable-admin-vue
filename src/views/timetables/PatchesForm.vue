<template>
  <Page title="Изменения в расписании">
    <div class="entry" v-for="entry in entries" :key="entry.id">
      <PatchesFormFragment :entry="entry" :index="entry.index"></PatchesFormFragment>
    </div>
    <Button theme="primary" @click.native="addPatch">Добавить изменение</Button>
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Page from '../Page.vue';
import { NavigationGuardNext, Route } from 'vue-router';
import { api } from '@/api';
import { TimetablePatch } from 'ggtu-timetable-api-client';
import { TimetablePatchDTO } from 'ggtu-timetable-api-client';
import { TimetableEntryType } from 'ggtu-timetable-api-client';
import PatchesFormFragment from '@/views/timetables/PatchesFormFragment.vue';

function patchesAdapter(patches: TimetablePatch[]): any {
  // patches.reduce((date))
  return patches;
}

Component.registerHooks([
  'beforeRouteEnter',
]);

@Component({
  name: 'RegularTimetable',
  components: { Page, PatchesFormFragment }
})
export default class PatchesForm extends Vue {

  entries: any = [];

  addPatch() {
    this.entries.push(this.createPatch())
  }

  createPatch(): TimetablePatchDTO {
    return {
      cabinetId: 0,
      dates: [(new Date()).toISOString().substring(0, 10)],
      groupId: 0,
      index: 0,
      lessonId: 0,
      teacherIds: [],
      type: TimetableEntryType.Lecture
    }
  }

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
