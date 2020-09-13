<template>
  <Page title="Преподаватели">
    <EntityControls
        create-route="/teachers/create"
        :filter-callback="filterCallback">
    </EntityControls>
    <EntityList
        v-show="!isEmpty"
        :entities="filteredEntities"
        editRoute="/teachers"
        :deleteCallback="deleteCallback"
    ></EntityList>
  </Page>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import EntityList from "@/components/entities/EntityList.vue";
import {namespace} from "vuex-class";
import Page from "@/views/Page.vue";
import EntityControls from "@/components/common/EntityControls.vue";
import entityListPage from "@/mixins/EntityListPage";
import {GET_ALL_ENTITIES} from "@/store/entities/action-types";
import {DataLoader} from "@/views/cabinets/DataLoader";
import {Store} from "vuex";
import {RootState} from "@/store/types";

const teachers = namespace('teachers');
class TeachersLoader implements DataLoader {

  constructor(protected store: Store<RootState>) {
  }

  async load() {
    await this.getAllTeachers();
  }

  private getAllTeachers() {
    return this.store.dispatch('teachers/' + GET_ALL_ENTITIES);
  }
}
@Component({
  name: 'Teachers',
  components: {Page, EntityList, EntityControls}
})
export default class Teachers extends entityListPage(teachers, TeachersLoader) {

}
</script>

<style>

</style>
