<template>
  <div class="entity-filter">
    <Field ref="field" inline name="entity-search" type="search" label="Поиск" @input="filter"></Field>
  </div>
</template>

<script lang="ts">

import {Component, Prop, Vue} from "vue-property-decorator";
import Field from '@/components/forms/Field.vue';
import { Ref } from 'vue-property-decorator';

@Component({
  name: 'EntityFilter',
  components: {Field}
})
export default class EntityFilter extends Vue {

  @Prop({ required: true })
  setFilterValue!: (filter: string) => void

  @Ref('field') field?: Field;

  mounted() {
    if (this.field) {
      this.field.focus();
    }
  }


  filter(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value.trim().toLowerCase();
    this.setFilterValue(value);
  }
}
</script>

<style scoped>
</style>
