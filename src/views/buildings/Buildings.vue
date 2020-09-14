<template>
  <Page title="Здания">
    <EntityControls
        create-route="/buildings/create"
        :filter-callback="filterCallback">
    </EntityControls>
    <Alert v-if="isEmpty && dataLoader.loaded" theme="warning">Записи не найдены</Alert>
    <Alert theme="info" v-if="dataLoader.isLoading">Загрузка...</Alert>
    <EntityList
        v-show="!isEmpty"
        :entities="filteredEntities"
        editRoute="/buildings"
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
import {AbstractDataLoader} from "@/views/cabinets/DataLoader";
import {Store} from "vuex";
import {RootState} from "@/store/types";
import {GET_ALL_ENTITIES} from "@/store/entities/action-types";

const buildings = namespace('buildings');

class BuildingsLoader extends AbstractDataLoader {

  constructor(store: Store<RootState>) {
    super(store);
  }

  async load() {
    return this.store.dispatch('buildings/' + GET_ALL_ENTITIES);
  }

}

@Component({
  name: 'Buildings',
  components: {Page, EntityList, EntityControls}
})
export default class Buildings extends entityListPage(buildings, BuildingsLoader) {

}
</script>

<style>

</style>
