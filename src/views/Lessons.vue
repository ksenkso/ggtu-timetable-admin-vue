<template>
  <Page title="Предметы">

  </Page>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Page from "./Page.vue";
import EntityControls from "../components/common/EntityControls.vue";
import EntityList from "../components/entities/EntityList.vue";
import {namespace} from "vuex-class";
import {NamedEntityDict} from "@/store/entities/types";
import {DELETE_ENTITY, GET_ALL_ENTITIES} from "@/store/entities/action-types";
import {SET_FILTER} from "@/store/entities/mutations-types";

const lessons = namespace('lessons');

@Component({
  name: 'Lessons',
  components: {Page, EntityControls, EntityList}
})
export default class Lessons extends Vue {
  @lessons.Getter('filteredEntities') lessons!: NamedEntityDict;
  @lessons.Action(GET_ALL_ENTITIES) getAll!: () => Promise<void>;
  @lessons.Action(DELETE_ENTITY) deleteCallback!: (id: number) => Promise<void>;
  @lessons.Mutation(SET_FILTER) filterCallback!: (filter: string) => void;
}
</script>

<style scoped>

</style>
