<template>
  <Page title="Кабинеты">
    <EntityControls
        create-route="/cabinets/create"
        :filter-callback="filterCallback"
    >
    </EntityControls>
    <EntityList
        v-show="!isEmpty"
        :entities="groups"
        editRoute="/groups"
        :deleteCallback="deleteCallback"
    ></EntityList>
  </Page>
</template>

<script lang="ts">
import Page from '@/views/Page.vue';
import {Component, Vue} from "vue-property-decorator";
import {namespace} from 'vuex-class';
import {DELETE_ENTITY, GET_ALL_ENTITIES} from '@/store/entities/action-types';
import {NamedEntityDict} from "@/store/entities/types";
import EntityList from "@/components/entities/EntityList.vue";
import {SET_FILTER} from "@/store/entities/mutations-types";
import EntityControls from "@/components/common/EntityControls.vue";

const cabinets = namespace('cabinets');

@Component({
  name: 'Cabinets',
  components: {Page, EntityList, EntityControls}
})
export default class Cabinets extends Vue {

  @cabinets.Getter('isEmpty') isEmpty!: boolean;
  @cabinets.Getter('filteredEntities') cabinets!: NamedEntityDict;
  @cabinets.Action(GET_ALL_ENTITIES) getAll!: () => Promise<void>;
  @cabinets.Action(DELETE_ENTITY) deleteCallback!: () => Promise<void>;
  @cabinets.Mutation(SET_FILTER) filterCallback!: (filter: string) => void;

  mounted() {
    this.getAll();
  }

}
</script>

<style scoped>

</style>
