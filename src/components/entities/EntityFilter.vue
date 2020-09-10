<template>
  <div class="entity-filter">
    <Field inline name="entity-search" type="search" label="Поиск" @input="filter"></Field>
  </div>
</template>z

<script lang="ts">

import {Component, Prop, Vue} from "vue-property-decorator";
import Field from "@/components/forms/Field.vue";

@Component({
  name: 'EntityFilter',
  components: {Field}
})
export default class EntityFilter extends Vue {

  @Prop({required: true})
  filterCallback!: (filter: string) => void


  filter(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterCallback(value);
  }
}
</script>

<style scoped>
</style>
