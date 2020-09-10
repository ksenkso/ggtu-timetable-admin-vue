<template>
  <Page title="Преподаватели">
    <div class="entity-controls">
      <EntityFilter :filter-callback="filterCallback"></EntityFilter>
      <router-link to="/teachers/create" class="button button_theme-primary">Добавить</router-link>
    </div>
    <EntityList
        :entities="teachers"
        editRoute="/teachers"
        :deleteCallback="deleteCallback"
    ></EntityList>
  </Page>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import EntityList from "@/components/entities/EntityList.vue";
import {NamedEntityDict} from "@/store/entities/types";
import {DELETE_ENTITY, GET_ALL_ENTITIES} from "@/store/entities/action-types";
import {namespace} from "vuex-class";
import Page from "@/views/Page.vue";
import {SET_FILTER} from "@/store/entities/mutations-types";
import EntityFilter from "@/components/entities/EntityFilter.vue";
import Button from "@/components/common/Button.vue";

const teachers = namespace('teachers');

@Component({
  name: 'Teachers',
  components: {Page, Button, EntityList, EntityFilter}
})
export default class Teachers extends Vue {
  @teachers.Getter('filteredEntities') teachers!: NamedEntityDict;
  @teachers.Action(GET_ALL_ENTITIES) getAll!: () => Promise<void>;
  @teachers.Action(DELETE_ENTITY) deleteCallback!: (id: number) => Promise<void>;
  @teachers.Mutation(SET_FILTER) filterCallback!: (filter: string) => void;
  mounted() {
    this.getAll();
  }

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
