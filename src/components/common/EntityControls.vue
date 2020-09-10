<template>
  <div class="entity-controls">
    <EntityFilter :filter-callback="filterCallback"></EntityFilter>
    <router-link :to="createRoute" class="button button_theme-primary">Добавить</router-link>
  </div>
</template>

<script lang="ts">

import {Component, Prop, Vue} from "vue-property-decorator";
import EntityFilter from "@/components/entities/EntityFilter.vue";

@Component({
  name: 'EntityControls',
  components: {EntityFilter}
})
export default class EntityControls extends Vue {
  @Prop({required: true})
  filterCallback!: (filter: string) => void

  @Prop({required: true})
  createRoute!: string;
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
