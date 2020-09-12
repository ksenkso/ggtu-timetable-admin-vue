<template>
  <Page title="Здания">
    <EntityControls
        create-route="/buildings/create"
        :filter-callback="filterCallback">
    </EntityControls>
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

const buildings = namespace('buildings');

@Component({
  name: 'Buildings',
  components: {Page, EntityList, EntityControls}
})
export default class Buildings extends entityListPage(buildings) {

}
</script>

<style>

</style>
