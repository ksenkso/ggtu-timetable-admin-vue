<template>
  <Page :title="title">
    <PatchForm @submit="saveLesson" :group-id="groupId"></PatchForm>
  </Page>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Page from '../Page.vue';
import PatchForm from '@/views/timetables/PatchForm.vue';
import {namespace} from 'vuex-class';
import {CreatePatchDto, Group, Patch} from 'ggtu-timetable-api-client';
import {ADD_PATCH, GET_GROUP} from '@/store/editor/action-types';
import {NavigationGuardNext, Route} from 'vue-router';

const editor = namespace('editor');

Component.registerHooks([
  'beforeRouteEnter'
]);

@Component({
  name: 'CreatePatch',
  components: {Page, PatchForm}
})
export default class CreatePatch extends Vue {

  @editor.State('groupId') groupId!: number;
  @editor.Action(GET_GROUP) getGroup!: (groupId: number) => Promise<void>;
  @editor.Action(ADD_PATCH) createPatch!: (patch: CreatePatchDto) => Promise<void>
  @editor.State('patches') patches!: { id: string; patch: Patch }[];
  @editor.State('group') group?: Group;
  isLoading = true;

  get title(): string {
    let title = 'Добавить изменения: ';
    if (this.group) {
      title += `: ${this.group.name}`;
    }
    if (this.isLoading) {
      title += '. Загрузка...'
    }
    return title;
  }

  saveLesson(data: CreatePatchDto) {
    this.createPatch(data)
        .then(() => {
          this.$router.push({name: 'PatchesView', params: {groupId: this.groupId.toString()}})
        })
  }

  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    const groupId = +to.params.groupId;
    if (!groupId) {
      next('/');
    } else {
      next(async vm => {
        const instance = vm as CreatePatch;
        // if groupId was not set in vuex
        // or if group was not fetched
        // or if groupId in the route is different from vuex -> fetch group

        if (!instance.groupId || !instance.group || instance.groupId !== groupId) {
          await instance.getGroup(groupId);
        }
        instance.isLoading = false;
      })
    }
  }
}
</script>

<style scoped>

</style>
