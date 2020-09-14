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
import {AbstractDataLoader} from "@/views/cabinets/DataLoader";
import {Store} from "vuex";
import {RootState} from "@/store/types";

const lessons = namespace('lessons');
class LessonsLoader extends AbstractDataLoader {

  constructor(store: Store<RootState>) {
    super(store);
  }

  async load() {
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
