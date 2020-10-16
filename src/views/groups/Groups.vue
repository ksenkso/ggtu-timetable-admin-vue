<template>
  <Page title="Группы">
    <EntityControls
        create-route="/groups/create"
        :set-filter-value="setFilterValue">
    </EntityControls>
    <Alert v-if="isEmpty && dataLoader.loaded" theme="warning">Записи не найдены</Alert>
    <Alert theme="info" v-if="dataLoader.isLoading">Загрузка...</Alert>
    <EntityList
        v-show="!isEmpty"
        :entities="filteredEntities"
        editRoute="/groups"
        :deleteCallback="deleteCallback"
    >
      <template v-slot:item="{entity}">
        <router-link class="entity-list__link" :to="`/groups/${entity.id}`">{{ entity.name }}</router-link>
        <router-link class="button" :to="{name: 'TimetableForm', params: {groupId: entity.id}}">Расписание</router-link>
        <router-link class="button" :to="{name: 'PatchesView', params: {groupId: entity.id}}">Изменения</router-link>
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
import {RootState} from "@/store/types";
import {Store} from "vuex";
import {AbstractDataLoader} from "@/views/cabinets/DataLoader";

const groups = namespace('groups');

class GroupsLoader extends AbstractDataLoader {

  constructor(store: Store<RootState>) {
    super(store);
  }

  async load() {
    return this.store.dispatch('groups/' + GET_ALL_ENTITIES);
  }

}

@Component({
  name: 'Groups',
  components: {Page, EntityList, EntityControls}
})
export default class Groups extends entityListPage(groups, GroupsLoader) {

}
</script>

<style scoped>

</style>
