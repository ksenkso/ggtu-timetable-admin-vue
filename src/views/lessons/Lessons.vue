<template>
  <Page title="Предметы">
    <EntityControls
        create-route="/lessons/create"
        :filter-callback="filterCallback">
    </EntityControls>
    <EntityList
        v-show="!isEmpty"
        :entities="filteredEntities"
        editRoute="/lessons"
        :deleteCallback="deleteCallback">
    </EntityList>
  </Page>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import Page from "../Page.vue";
import EntityControls from "../../components/common/EntityControls.vue";
import EntityList from "../../components/entities/EntityList.vue";
import {namespace} from "vuex-class";
import entityListPage from "@/mixins/EntityListPage";
import {GET_ALL_ENTITIES} from "@/store/entities/action-types";
import {Store} from "vuex";
import {RootState} from "@/store/types";
import {DataLoader} from "@/views/cabinets/DataLoader";

const lessons = namespace('lessons');
class LessonsLoader implements DataLoader {

  constructor(protected store: Store<RootState>) {}

  async load() {
    await this.getAllLessons();
  }

  private getAllLessons() {
    return this.store.dispatch('lessons/' + GET_ALL_ENTITIES);
  }
}
@Component({
  name: 'Lessons',
  components: {Page, EntityControls, EntityList}
})
export default class Lessons extends entityListPage(lessons, LessonsLoader) {

}
</script>

<style scoped>

</style>
