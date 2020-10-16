<template>
  <div class="form__list-box list-box">
    <div
        ref="optionsList"
        :class="optionsClass"
        v-if="showOptions"
        @click="onOptionClick"
    >
      <div
          class="list-box__option list-box__option_empty"
          v-show="!filteredOptions.length"
      >
        Нет опций
      </div>
      <div
          v-for="option in filteredOptions"
          :data-value="option.value"
          @mouseenter="onItemHover(option)"
          :key="option.value"
          :class="[
          'list-box__option',
          {
            'list-box__option_selected':
              selected && selected.value === option.value
          }
        ]"
      >
        {{ option.name }}
      </div>
    </div>
    <input
        ref="input"
        type="text"
        class="form__control"
        @input="onInput"
        @keydown.enter="onKeyboardSelect"
        @keydown.up="moveSelection(-1)"
        @keydown.down="moveSelection(1)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import { SelectOption } from '@/utils/lists';
import { Watch } from 'vue-property-decorator';

@Component({
  name: 'ListBox'
})
export default class ListBox extends Vue {
  @Prop() defaultValue?: number;
  @Prop({ required: true }) options!: SelectOption[];
  @Ref('input') input!: HTMLInputElement;
  @Ref('optionsList') optionsList!: HTMLDivElement;
  forceHideOptions = true;
  displayValue = '';
  selected: SelectOption | null = null;
  selectedIndex: number | null = null;
  optionsOnTop = false;
  prevLength = 0;

  get filteredOptions(): SelectOption[] {
    const newOptions = this.displayValue
        ? this.options.filter(option => this.matches(option, this.displayValue))
        : this.options;
    if (this.prevLength !== newOptions.length) {
      this.prevLength = newOptions.length;
      this.$nextTick(() => {
        this.checkOptionsPosition();
      });
    }
    return this.optionsOnTop ? newOptions.reverse() : newOptions;
  }

  get showOptions() {
    return !this.forceHideOptions && !!this.displayValue.trim();
  }

  get optionsClass() {
    return [
      'list-box__options',
      { 'list-box__options_top': this.optionsOnTop }
    ];
  }

  onItemHover(option: SelectOption) {
    this.selected = option;
  }

  onKeyboardSelect(e: KeyboardEvent) {
    if (this.selected !== null) {
      e.preventDefault();
      this.selectOption(this.selected.value);
    }
    return true;
  }

  moveSelection(n: number) {
    if (this.selectedIndex !== null) {
      let newIndex = this.selectedIndex + n;
      newIndex =
          newIndex >= 0
              ? newIndex % this.filteredOptions.length
              : this.filteredOptions.length + newIndex;
      this.selectedIndex = newIndex;
      this.selected = this.filteredOptions[newIndex];
    } else {
      this.selectedIndex = n === 1 ? 0 : this.filteredOptions.length - 1;
      this.selected = this.filteredOptions[this.selectedIndex];
    }
  }

  onOptionClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    this.selectOption(+(target.dataset.value as string));
  }

  selectOption(value: number) {
    const option = this.getOption(value);
    if (option) {
      this.selected = option;
      this.displayValue = this.selected.name;
      this.input.value = this.displayValue;
      this.forceHideOptions = true;
      this.$emit('select', this.selected.value);
    }
  }

  matches(option: SelectOption, filter: string) {
    return option.name.toLowerCase().includes(filter.toLowerCase());
  }

  onInput(e: InputEvent) {
    this.forceHideOptions = false;
    this.displayValue = (e.target as HTMLInputElement).value;
    if (!this.displayValue) {
      this.selected = null;
    } else if (this.filteredOptions.length) {
      this.selectedIndex = 0;
      this.selected = this.filteredOptions[this.selectedIndex];
    }
  }

  getOption(value: number) {
    return this.options.find(option => option.value === value);
  }

  checkOptionsPosition() {
    if (this.optionsList) {
      const rect = this.optionsList.getBoundingClientRect();
      const inputRect = this.input.getBoundingClientRect();
      this.optionsOnTop =
          rect.height + inputRect.bottom - window.innerHeight - window.scrollY >
          0;
    }
  }

  mounted() {
    if (this.defaultValue !== undefined) {
      this.selectOption(this.defaultValue);
    }
    document.addEventListener('scroll', this.checkOptionsPosition);
    document.addEventListener('resize', this.checkOptionsPosition);
  }

  @Watch('options')
  updateDisplayValue() {
    const selectedValue = this.selected
        ? this.selected.value
        : this.defaultValue;
    if (selectedValue !== undefined) {
      this.selectOption(selectedValue);
    }
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
    overflow: auto
    z-index: 999
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .13)

    &_top
      bottom: 100%
      top: auto

    ~ .list-box__input
      border-radius: 3px 3px 0 0

  &__option
    padding: 4px
    border-bottom: 1px solid #ddd
    cursor: pointer

    &:last-child
      border-bottom: none

    &_selected
      background-color: rgba(theme-color("primary"), .3)

    &_empty
      cursor: not-allowed
</style>
