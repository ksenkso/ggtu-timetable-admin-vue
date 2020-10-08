<template>
  <Page :title="title">
    <div class="patches">
      <div class="patch" v-for="patch in patches" :key="patch.id">
        <div class="patch__container">
          <div class="patch__main">
            <div class="patch__row">
              <h3>Предмет</h3>
              <div class="patch__subject">{{ patch.subject.name }}</div>
            </div>
            <div class="patch__row">
              <h3>Преподаватели</h3>
              <div class="patch__teacher" v-for="teacher in patch.teachers" :key="teacher.id">
                {{ teacher.name }}
              </div>
            </div>
            <div class="patch__row">
              <h3>Кабинеты</h3>
              <div class="patch__cabinet">{{ patch.cabinet | cabinetName }}</div>
            </div>
          </div>
          <div class="patch__dates">
            <div class="patch__row">
              <h3>Даты</h3>
              <div class="patch__date" v-for="date in patch.dates" :key="date">{{ date }}</div>
            </div>
          </div>
        </div>
        <div class="patch__bottom">
          <router-link class="button button_theme-light" :to="{name: 'EditPatch', params: {id: patch.id}}">
            Редактировать
          </router-link>
          <Button @click.native="tryRemovePatch(patch.id)" theme="danger">Отменить изменение</Button>
        </div>
      </div>
      <!--      <PatchesFormFragment :entry="patch" :group-id="group.id"></PatchesFormFragment>-->
    </div>
    <!--    <Button theme="primary" @click.native="addPatch">Добавить изменение</Button>-->
    <router-link class="button button_theme-primary" :to="addPatchLink">Добавить изменение</router-link>
  </Page>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Page from '../Page.vue';
import {NavigationGuardNext, Route} from 'vue-router';
import {api} from '@/api';
import {Cabinet, CreatePatchDto, Group, LessonType, Patch, UpdatePatchDto} from 'ggtu-timetable-api-client';
import PatchesFormFragment from '@/views/timetables/PatchesFormFragment.vue';
import { Location } from 'vue-router';

function patchesAdapter(patches: Patch[]): Patch[] {
  // patches.reduce((date))
  return patches;
}

Component.registerHooks([
  'beforeRouteEnter',
]);

@Component({
  name: 'PatchesView',
  components: { Page, PatchesFormFragment },
  filters: {
    cabinetName(cabinet: Cabinet) {
      return cabinet.building
          ? cabinet.building.name + ', ' + cabinet.name
          : cabinet.name;
    }
  }
})
export default class PatchesView extends Vue {

  patches: (Patch | UpdatePatchDto)[] = [];
  group: Group | null = null;
  isLoading = true;

  get addPatchLink(): Location {
    return {
      name: 'AddPatchForGroup',
      params: {
        groupId: this.$route.params.groupId
      }
    }
  }

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
              (vm as PatchesView).group = group;
            })
        api.patches.getForGroup(+to.params.groupId)
            .then(patches => {
              (vm as PatchesView).patches = patchesAdapter(patches);
              (vm as PatchesView).isLoading = false;
            })
      })
    }
  }
}
</script>

<style scoped lang="sass">
.patches
  display: flex
  flex-direction: column
  row-gap: 1rem
  margin-bottom: 1rem

.patch
  padding: 2em 1em
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .13)
  max-width: 800px

  &__row
    margin-bottom: 1rem

    h3
      margin: 0

  &__container
    display: flex
    justify-content: space-between
    @media (max-width: 768px)
      flex-direction: column

  &__dates
    flex: 0 0 120px
    @media (max-width: 768px)
      flex: initial

  &__main
    @media (max-width: 768px)
      order: 2

  &__bottom
    margin-top: 1rem
    display: flex
    column-gap: 1rem
    justify-content: flex-end
    @media (max-width: 768px)
      justify-content: space-between
    @media (max-width: 650px)
      flex-direction: column
      justify-content: initial
      row-gap: 1rem
      column-gap: 0

</style>
