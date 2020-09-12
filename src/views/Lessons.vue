<template>
  <Page title="Предметы">
    <EntityControls
        create-route="/lessons/create"
        :filter-callback="filterCallback">
    </EntityControls>
    <EntityList
        v-show="!isEmpty"
        :entities="filteredEntities"
        editRoute="/lessons"
        :deleteCallback="deleteCallback"
    ></EntityList>
  </Page>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import Page from "./Page.vue";
import EntityControls from "../components/common/EntityControls.vue";
import EntityList from "../components/entities/EntityList.vue";
import {namespace} from "vuex-class";
import entityListPage from "@/mixins/EntityListPage";

const lessons = namespace('lessons');

@Component({
  name: 'Lessons',
  components: {Page, EntityControls, EntityList}
})
export default class Lessons extends entityListPage(lessons) {

}
</script>

<style scoped>

</style>
