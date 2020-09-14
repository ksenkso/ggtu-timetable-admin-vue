<template>
  <Page title="Преподаватели">
    <EntityControls
        create-route="/teachers/create"
        :filter-callback="filterCallback">
    </EntityControls>
    <Alert v-if="isEmpty && dataLoader.loaded" theme="warning">Записи не найдены</Alert>
    <Alert theme="info" v-if="dataLoader.isLoading">Загрузка...</Alert>
    <EntityList
        v-show="dataLoader.loaded && !isEmpty"
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
import {AbstractDataLoader} from "@/views/cabinets/DataLoader";
import {Store} from "vuex";
import {RootState} from "@/store/types";
import Alert from "@/components/common/Alert.vue";

const teachers = namespace('teachers');

class TeachersLoader extends AbstractDataLoader {

  constructor(store: Store<RootState>) {
    super(store);
  }

  load() {
    return this.store.dispatch('teachers/' + GET_ALL_ENTITIES);
  }
}

@Component({
  name: 'Teachers',
  components: {Page, EntityList, EntityControls, Alert}
})
export default class Teachers extends entityListPage(teachers, TeachersLoader) {

}
</script>

<style>

</style>
