<template>
  <Page title="Преподаватели">
    <EntityControls
        create-route="/teachers/create"
        :filter-callback="filterCallback">
    </EntityControls>
    <EntityList
        v-show="!isEmpty"
        :entities="teachers"
        editRoute="/teachers"
        :deleteCallback="deleteCallback"
    ></EntityList>
  </Page>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import EntityList from "@/components/entities/EntityList.vue";
import {NamedEntityDict} from "@/store/entities/types";
import {DELETE_ENTITY} from "@/store/entities/action-types";
import {namespace} from "vuex-class";
import Page from "@/views/Page.vue";
import {SET_FILTER} from "@/store/entities/mutations-types";
import EntityControls from "@/components/common/EntityControls.vue";
import entityPage from "@/mixins/EntityListPage";

const teachers = namespace('teachers');

@Component({
  name: 'Teachers',
  components: {Page, EntityList, EntityControls}
})
export default class Teachers extends entityPage(teachers) {
  @teachers.Getter('isEmpty') isEmpty!: boolean;
  @teachers.Getter('filteredEntities') teachers!: NamedEntityDict;
  // @teachers.Action(GET_ALL_ENTITIES) getAll!: () => Promise<void>;
  @teachers.Action(DELETE_ENTITY) deleteCallback!: (id: number) => Promise<void>;
  @teachers.Mutation(SET_FILTER) filterCallback!: (filter: string) => void;

}
</script>

<style scoped lang="sass">
.entity-controls
  width: 100%
  display: flex
  justify-content: space-between
  align-items: center
  padding: 1em
</style>
