<template>
  <Page title="Группы">
    <EntityControls
      create-route="/groups/create"
      :filter-callback="filterCallback"
    >
    </EntityControls>
    <EntityList
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

const groups = namespace('groups');

@Component({
  name: 'Groups',
  components: {Page, EntityList, EntityControls}
})
export default class Groups extends Vue {

  @groups.Getter('filteredEntities') groups!: NamedEntityDict;
  @groups.Action(GET_ALL_ENTITIES) getAll!: () => Promise<void>;
  @groups.Action(DELETE_ENTITY) deleteCallback!: () => Promise<void>;
  @groups.Mutation(SET_FILTER) filterCallback!: (filter: string) => void;

  mounted() {
    this.getAll();
  }


}
</script>

<style scoped>

</style>
