<template>
  <Page title="Группы">
    <EntityControls
        create-route="/groups/create"
        :filter-callback="filterCallback">
    </EntityControls>
    <EntityList
        v-show="!isEmpty"
        :entities="filteredEntities"
        editRoute="/groups"
        :deleteCallback="deleteCallback"
    ></EntityList>
  </Page>
</template>

<script lang="ts">
import Page from '@/views/Page.vue';
import {Component} from "vue-property-decorator";
import {namespace} from 'vuex-class';
import EntityList from "@/components/entities/EntityList.vue";
import EntityControls from "@/components/common/EntityControls.vue";
import entityListPage from "@/mixins/EntityListPage";

const groups = namespace('groups');

@Component({
  name: 'Groups',
  components: {Page, EntityList, EntityControls}
})
export default class Groups extends entityListPage(groups) {

}
</script>

<style scoped>

</style>
