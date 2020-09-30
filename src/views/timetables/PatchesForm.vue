<template>
  <Page :title="title">
    <div class="entry" v-for="entry in entries" :key="entry.id">
      <PatchesFormFragment :entry="entry" :group-id="group.id"></PatchesFormFragment>
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
import { Group } from 'ggtu-timetable-api-client';

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
  group: Group | null = null;
  isLoading = true;

  get title(): string {
    let title = 'Изменения в расписании';
    if (this.group) {
      title += `: ${this.group.name}`;
    }
    if (this.isLoading) {
      title += '. Загрузка...'
    }
    return title;
  }

  addPatch() {
    this.entries.push(this.createPatch())
  }

  createPatch(): TimetablePatchDTO {
    return {
      id: Math.random() * .9,
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
        api.groups.get(+to.params.groupId)
            .then(group => {
              (vm as PatchesForm).group = group;
            })
        api.patches.getForGroup(+to.params.groupId)
            .then(patches => {
              (vm as PatchesForm).entries = patchesAdapter(patches);
              (vm as PatchesForm).isLoading = false;
            })
      })
    }
  }
}
</script>

<style scoped>

</style>
