<template>
  <div class="form__list-box list-box">
    <div
        class="list-box__options"
        v-if="showOptions"
        @click="onOptionClick"
    >
      <div class="list-box__option list-box__option_empty" v-show="!filteredOptions.length">Нет опций</div>
      <div
          v-for="(option, index) in filteredOptions"
          :data-index="index"
          :key="option.value"
          :class="`list-box__option${selected && selected.value === option.value ? ' list-box__option_selected' : ''}`">
        {{ option.name }}
      </div>
    </div>
    <input ref="input"
           type="text"
           class="list-box__input"
           v-model="displayValue"
           @blur="onBlur"
           @input="onInput"
           @keydown.space.enter="onKeyboardSelect"
           @keydown.up="moveSelection(-1)"
           @keydown.down="moveSelection(1)"
    >
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

  onBlur() {
    this.forceHideOptions = true;
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
    if (target.dataset.index !== undefined) {
      this.selectOption(+target.dataset.index);
    }
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
    } else {
      if (this.filteredOptions.length) {
        this.selectedIndex = 0;
        this.selected = this.filteredOptions[this.selectedIndex]
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
  position: relative

  &__input
    width: 100%
    box-sizing: border-box
    display: block
    border: 1px solid #aaa
    border-radius: 3px
    padding: 6px 8px 2px 8px
    &:focus
      outline-color: scale-color(theme-color("primary"), $lightness: 30%)
      border-bottom-left-radius: 0
      border-bottom-right-radius: 0
      outline-offset: 0
  &__options
    position: absolute
    top: 100%
    width: 100%
    background-color: #ffffff
    border: 1px solid #ddd
    border-radius: 0 0 3px 3px
    max-height: 8 * 35px
    overflow: hidden
    z-index: 999
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .13)
    ~ .list-box__input
      border-radius: 3px 3px 0 0

  &__option
    padding: 4px
    border-bottom: 1px solid #ddd

    &:last-child
      border-bottom: none

    &_selected
      background-color: rgba(theme-color("primary"), .3)

    &_empty
      cursor: not-allowed

</style>
