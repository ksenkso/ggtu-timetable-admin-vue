<template>
  <Page :title="title">
    <div class="entry" v-for="patch in patches" :key="patch.id">
      <div class="patch">
        <h3>Предмет</h3>
        <div class="patch__subject">{{ patch.subject.name }}</div>
        <div class="patch__teachers">
          <h3>Преподаватели</h3>
          <div class="patch__teacher" v-for="teacher in patch.teachers" :key="teacher.id">
            {{ teacher.name }}
          </div>
        </div>
        <div class="patch__dates">
          <h3>Даты</h3>
          <div class="patch__date" v-for="date in patch.dates" :key="date">{{ date }}</div>
        </div>
        <div class="patch__cabinet">{{ patch.cabinet | cabinetName }}</div>
        <router-link :to="{name: 'EditPatch', params: {id: patch.id}}"></router-link>
        <Button @click.native="tryRemovePatch(patch.id)" theme="danger">Отменить изменение</Button>
      </div>
<!--      <PatchesFormFragment :entry="patch" :group-id="group.id"></PatchesFormFragment>-->
    </div>
    <Button theme="primary" @click.native="addPatch">Добавить изменение</Button>
  </Page>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Page from '../Page.vue';
import {NavigationGuardNext, Route} from 'vue-router';
import {api} from '@/api';
import {Cabinet, CreatePatchDto, Group, LessonType, Patch, UpdatePatchDto} from 'ggtu-timetable-api-client';
import PatchesFormFragment from '@/views/timetables/PatchesFormFragment.vue';

function patchesAdapter(patches: Patch[]): Patch[] {
  // patches.reduce((date))
  return patches;
}

Component.registerHooks([
  'beforeRouteEnter',
]);

@Component({
  name: 'RegularTimetable',
  components: {Page, PatchesFormFragment},
  filters: {
    cabinetName(cabinet: Cabinet) {
      return cabinet.building
          ? cabinet.building.name + ', ' + cabinet.name
          : cabinet.name;
    }
  }
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

  tryRemovePatch(patchId: number) {
    const shouldDelete = confirm('Отменить изменение?');
    if (shouldDelete) {
      console.log(patchId);
    }
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
