<template>
  <Page :title="title">
    <router-link class="button button_theme-primary" :to="addPatchLink">Добавить изменение</router-link>
    <div class="patches">
      <div class="patch" v-for="entry in patches" :key="entry.id">
        <div class="patch__container">
          <div class="patch__main">
            <div class="patch__row">
              <h3>Предмет</h3>
              <div class="patch__subject">{{ entry.patch.subject.name }}</div>
            </div>
            <div class="patch__row">
              <h3>Преподаватели</h3>
              <div class="patch__teacher" v-for="teacher in entry.patch.teachers" :key="teacher.id">
                {{ teacher.name }}
              </div>
            </div>
            <div class="patch__row">
              <h3>Кабинеты</h3>
              <div class="patch__cabinet">{{ entry.patch.cabinet | cabinetName }}</div>
            </div>
          </div>
          <div class="patch__dates">
            <div class="patch__row">
              <h3>Пара {{ entry.patch.index + 1 }}</h3>
            </div>
            <div class="patch__row">
              <h3>Даты</h3>
              <div class="patch__date" v-for="date in entry.patch.dates" :key="date">{{ date }}</div>
            </div>
          </div>
        </div>
        <div class="patch__bottom">
          <router-link class="button button_theme-light" :to="{name: 'EditPatch', params: {id: entry.patch.id}}">
            Редактировать
          </router-link>
          <Button @click.native="tryRemovePatch(entry.patch.id)" theme="danger">Отменить изменение</Button>
        </div>
      </div>
    </div>
  </Page>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Page from '../Page.vue';
import {Location, NavigationGuardNext, Route} from 'vue-router';
import {Group, Patch} from 'ggtu-timetable-api-client';
import {GET_GROUP, GET_PATCHES, REMOVE_PATCH} from '@/store/editor/action-types';
import {namespace} from 'vuex-class';

const editor = namespace('editor');

Component.registerHooks([
  'beforeRouteEnter',
]);

@Component({
  name: 'PatchesView',
  components: {Page}
})
export default class PatchesView extends Vue {

  @editor.State('patches') patches!: { id: string; patch: Patch }[];
  @editor.Action(GET_PATCHES) getPatches!: (groupId: number) => Promise<void>;
  @editor.Action(GET_GROUP) getGroup!: (groupId: number) => Promise<void>;
  @editor.Action(REMOVE_PATCH) removePatch!: (patchId: number) => Promise<void>;
  @editor.State('group') group?: Group;
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
      this.removePatch(patchId);
    }
  }

  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    if (!to.params.groupId) {
      next('/');
    } else {
      next((vm: Vue) => {
        const instance = vm as PatchesView;
        instance.isLoading = true;
        instance.getGroup(+to.params.groupId)
            .then(() => instance.getPatches(+to.params.groupId))
            .then(() => instance.isLoading = false);
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
  margin-top: 1rem

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
