<template>
  <div class="form__list-box list-box">
    <input ref="input"
           type="text"
           class="list-box__input"
           v-model="displayValue"
           @input="onInput"
           @keydown.space.enter="onKeyboardSelect"
           @keydown.up="moveSelection(-1)"
           @keydown.down="moveSelection(1)"
    >
    <div
        class="list-box__options"
        v-show="showOptions"
        @click="onOptionClick"
    >
      <div
          v-for="(option, index) in filteredOptions"
          :data-index="index"
          :key="option.value"
          :class="`list-box__option${selected && selected.value === option.value && ' list-box__option_selected'}`">
        {{ option.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {SelectOption} from "./Select.vue";

@Component({
  name: 'ListBox'
})
export default class ListBox extends Vue {
  @Prop({required: true}) options!: SelectOption[];
  forceHideOptions = false;
  displayValue = '';
  selected: SelectOption | null = null;
  selectedIndex: number | null = null;

  get filteredOptions(): SelectOption[] {
    return this.displayValue
        ? this.options.filter(option => this.matches(option, this.displayValue))
        : this.options;
  }

  log(e: KeyboardEvent) {
    console.log(e.code);
  }

  onKeyboardSelect(e: KeyboardEvent) {
    if (this.selectedIndex !== null) {
      e.preventDefault();
      this.selectOption(this.selectedIndex);
    }
  }

  moveSelection(n: number) {
    if (this.selectedIndex !== null) {
      let newIndex = (this.selectedIndex + n);
      newIndex = newIndex >= 0 ? newIndex % this.filteredOptions.length : this.filteredOptions.length + newIndex
      this.selectedIndex = newIndex;
      this.selected = this.filteredOptions[newIndex];
    } else {
      this.selectedIndex = n === 1 ? 0 : this.filteredOptions.length - 1;
      this.selected = this.filteredOptions[this.selectedIndex];
    }
  }

  onOptionClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    // typescript will scream if i will not check for undefined
    const index = target.dataset.index ? +target.dataset.index : 0;
    console.log(index);
    this.selectOption(index);
  }

  selectOption(index: number) {
    this.selected = this.filteredOptions[index];
    this.displayValue = this.selected.name;
    this.forceHideOptions = true;
    this.$emit('select', this.selected.value);
  }

  matches(option: SelectOption, filter: string) {
    return option.name.toLowerCase().includes(filter.toLowerCase())
  }

  onInput() {
    this.forceHideOptions = false;
    if (this.selected) {
      if (!this.matches(this.selected, this.displayValue)) {
        this.selected = null;
      }
    }
  }

  get showOptions() {
    return !this.forceHideOptions && !!this.displayValue.trim();
  }
}
</script>

<style scoped lang="sass">
@import "../../assets/functions"
.list-box
  &__option
    &_selected
      background-color: rgba(theme-color("primary"), .5)
</style>
