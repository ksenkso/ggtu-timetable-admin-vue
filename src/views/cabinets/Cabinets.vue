<template>
  <Page title="Кабинеты">
    <EntityControls
        create-route="/cabinets/create"
        :filter-callback="filterCallback"
    >
    </EntityControls>
    <Alert v-if="isEmpty && dataLoader.loaded" theme="warning">Записи не найдены</Alert>
    <Alert theme="info" v-if="dataLoader.isLoading">Загрузка...</Alert>
    <EntityList
        v-if="!isEmpty && dataLoader.loaded"
        :entities="filteredEntities"
        editRoute="/cabinets"
        :deleteCallback="deleteCallback"
    >
      <template v-slot:item="{ entity }">
        <router-link class="entity-list__link" :to="`/cabinets/${entity.id}`">
          {{ buildings[entity.buildingId].name.split(' ')[1] }}к{{ entity.number }}
        </router-link>
      </template>
    </EntityList>
  </Page>
</template>

<script lang="ts">
import Page from '@/views/Page.vue';
import {Component} from "vue-property-decorator";
import {namespace} from 'vuex-class';
import EntityList from "@/components/entities/EntityList.vue";
import EntityControls from "@/components/common/EntityControls.vue";
import entityListPage from "@/mixins/EntityListPage";
import {GET_ALL_ENTITIES} from "@/store/entities/action-types";
import {NamedEntityDict} from "@/store/entities/types";
import {Store} from "vuex";
import {RootState} from "@/store/types";
import {AbstractDataLoader} from "@/views/cabinets/DataLoader";

const cabinets = namespace('cabinets');
const buildings = namespace('buildings');

class CabinetsLoader extends AbstractDataLoader{

  constructor(store: Store<RootState>) {
    super(store);
  }

  async load() {
    await this.store.dispatch('buildings/' + GET_ALL_ENTITIES);
    return this.store.dispatch('cabinets/' + GET_ALL_ENTITIES);
  }
}

@Component({
  name: 'Cabinets',
  components: {Page, EntityList, EntityControls}
})
export default class Cabinets extends entityListPage(cabinets, CabinetsLoader) {

  @buildings.State('entities') buildings!: NamedEntityDict;
  @buildings.Getter('isEmpty') isBuildingsEmpty!: boolean;
}
</script>

<style scoped>

</style>
