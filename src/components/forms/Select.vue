<template>
  <select :name="name" :id="id" @change="onChange" class="form__control">
    <option v-for="(option, index) in options" :key="index" :value="option.value">{{ option.name }}</option>
  </select>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

export interface SelectOption {
  name: string;
  value: any;
}

@Component({
  name: 'Select'
})
export default class Select extends Vue {
  @Prop({required: true}) name!: string;
  @Prop({required: true}) options!: SelectOption[];

  get id() {
    return `${this.name}_${this.$vnode.tag}`;
  }

  mounted() {
    this.$emit('change', {target: {value: this.options[0].value}});
  }

  onChange(event: Event) {
    this.$emit('change', this.options[(event.target as HTMLSelectElement).selectedIndex].value);
  }

}
</script>

<style scoped>

</style>
