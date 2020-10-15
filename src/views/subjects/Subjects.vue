<template>
  <Page title="Предметы">
    <EntityControls
        create-route="/lessons/create"
        :set-filter-value="setFilterValue">
    </EntityControls>
    <Alert v-if="isEmpty && dataLoader.loaded" theme="warning">Записи не найдены</Alert>
    <Alert theme="info" v-if="dataLoader.isLoading">Загрузка...</Alert>
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

const subjects = namespace('subjects');

class LessonsLoader extends AbstractDataLoader {

  constructor(store: Store<RootState>) {
    super(store);
  }

  async load() {
    return this.store.dispatch('subjects/' + GET_ALL_ENTITIES);
  }

}

@Component({
  name: 'Subjects',
  components: {Page, EntityControls, EntityList}
})
export default class Subjects extends entityListPage(subjects, LessonsLoader) {

}
</script>

<style scoped>

</style>
