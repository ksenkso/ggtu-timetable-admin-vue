<template>
  <Page :title="title">
    <PatchForm v-if="!isLoading" @submit="saveLesson" :entry="patch" :group-id="groupId"></PatchForm>
  </Page>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Page from '../Page.vue';
import PatchForm from '@/views/timetables/PatchForm.vue';
import {namespace} from 'vuex-class';
import {Group, Patch, UpdatePatchDto} from 'ggtu-timetable-api-client';
import {GET_GROUP, UPDATE_PATCH} from '@/store/editor/action-types';
import {NavigationGuardNext, Route} from 'vue-router';
import {api} from "@/api";

const editor = namespace('editor');

Component.registerHooks([
  'beforeRouteEnter'
]);

@Component({
  name: 'EditPatch',
  components: {Page, PatchForm}
})
export default class EditPatch extends Vue {

  @editor.State('groupId') groupId!: number;
  @editor.Action(GET_GROUP) getGroup!: (groupId: number) => Promise<void>;
  @editor.Action(UPDATE_PATCH) updatePatch!: (patch: UpdatePatchDto) => Promise<void>
  @editor.State('patches') patches!: { id: string; patch: Patch }[];
  @editor.State('group') group?: Group;
  isLoading = true;
  notFound = false;
  patch?: Patch = {} as Patch;

  get title(): string {
    let title = 'Правка изменений: ';
    if (this.group) {
      title += `: ${this.group.name}`;
    }
    if (this.isLoading) {
      title += '. Загрузка...'
    }
    return title;
  }

  saveLesson(data: UpdatePatchDto) {
    console.log(data);
    this.updatePatch(data)
        .then(() => {
          this.$router.push({name: 'PatchesView', params: {groupId: this.groupId.toString()}})
        })
  }

  beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
    const patchId = +to.params.id;
    if (!patchId) {
      next('/');
    } else {
      next(async vm => {
        const instance = vm as EditPatch;
        const toUpdate: { id: string; patch: Patch } | undefined = instance.patches.find(entry => entry.patch.id === patchId);
        if (!toUpdate) {
          try {
            instance.patch = await api.patches.get(patchId);
            if (!instance.groupId || !instance.group || instance.groupId !== instance.patch.groupId) {
              await instance.getGroup(instance.patch.groupId);
            }
          } catch (error) {
            if (error.statusCode === 'NotFound') {
              instance.notFound = true;
            }
          }
        } else {
          instance.patch = toUpdate.patch;
        }
        instance.isLoading = false;
      })
    }
  }
}
</script>

<style scoped>

</style>
