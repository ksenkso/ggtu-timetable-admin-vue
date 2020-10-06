<template>
  <Page :title="title">
    <div class="entry" v-for="patch in patches" :key="patch.id">
      <PatchesFormFragment :entry="patch" :group-id="group.id"></PatchesFormFragment>
    </div>
    <Button theme="primary" @click.native="addPatch">Добавить изменение</Button>
  </Page>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Page from '../Page.vue';
import {NavigationGuardNext, Route} from 'vue-router';
import {api} from '@/api';
import {CreatePatchDto, Group, LessonType, Patch, UpdatePatchDto} from 'ggtu-timetable-api-client';
import PatchesFormFragment from '@/views/timetables/PatchesFormFragment.vue';

function patchesAdapter(patches: Patch[]): any {
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

  patches: (Patch | UpdatePatchDto)[] = [];
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

  getLessonKey(lesson: Patch | CreatePatchDto): number {
    if ((lesson as Patch).id) {
      return (lesson as Patch).id;
    }
    return -Math.random();
  }

  addPatch() {
    this.patches.push(this.createPatch())
  }

  createPatch(): UpdatePatchDto {
    return {
      id: Math.random() * .9,
      cabinetId: 0,
      dates: [(new Date()).toISOString()],
      groupId: 0,
      index: 0,
      subjectId: 0,
      teacherIds: [],
      type: LessonType.Lecture
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
              (vm as PatchesForm).patches = patchesAdapter(patches);
              (vm as PatchesForm).isLoading = false;
            })
      })
    }
  }
}
</script>

<style scoped>

</style>
