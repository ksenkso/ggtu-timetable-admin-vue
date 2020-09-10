<template>
  <button :type="type" :disabled="disabled" :class="className">
    <slot>{{'Кнопка'}}</slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      required: false
    },
    type: {
      type: String,
      default: 'button'
    }
  },
  computed: {
    className() {
      return `button${this.theme ? ` button_theme-${this.theme}` : ''}`;
    }
  }
}
</script>

<style lang="sass">
@import "../../assets/functions"
.button
  border: 1px solid theme-color("dark")
  padding: 6px 12px
  border-radius: 3px
  background-color: #fff
  vertical-align: middle
  cursor: pointer
  transition: filter .1s ease-in-out
  text-decoration: none
  &[disabled]
    filter: grayscale(70%)
    color: theme-color("light")
  &_block
    display: block
    width: 100%
  &_theme
    @each $mod, $color in $colors
      &-#{$mod}
        background: $color
        border: none
        color: map-get($bgToTextMapping, $mod)
        outline-color: scale-color($color, $lightness: 30%)
        @if($mod == "light")
          border: 1px solid theme-color("gray")


</style>
