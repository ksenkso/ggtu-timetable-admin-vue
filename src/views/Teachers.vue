<template>
  <Page title="Преподаватели">
    <EntityControls
        create-route="/teachers/create"
        :filter-callback="filterCallback">
    </EntityControls>
    <EntityList
        v-show="!isEmpty"
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

const teachers = namespace('teachers');

@Component({
  name: 'Teachers',
  components: {Page, EntityList, EntityControls}
})
export default class Teachers extends entityListPage(teachers) {

}
</script>

<style>

</style>
