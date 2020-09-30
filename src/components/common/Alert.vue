<template>
  <div :class="className">
      <h3 class="alert__title" v-if="title">{{title}}</h3>
    <slot></slot>
  </div>
</template>

<script lang="ts">

import {Component, Prop, Vue} from "vue-property-decorator";

@Component({
  name: 'Alert'
})
export default class Alert extends Vue {

  @Prop() theme?: string;
  @Prop() title?: string;

  get className() {
    return `alert${this.theme ? ' alert_theme-' + this.theme : ''}`;
  }

}
</script>

<style scoped lang="sass">
@import '../../assets/variables'
@import '../../assets/functions'
.alert
  padding: 12px 16px
  border: 1px solid #ddd
  border-radius: 3px
  margin: 1em 0
  display: flex
  align-items: center

  &_theme
    @each $mod, $color in $colors
      &-#{$mod}
        background: rgba($color, .3)
        color: #000
        border-color: rgba($color, 0.3)
        @if ($mod == "light")
          border: 1px solid theme-color("gray")

  &__title
    margin-top: 0
    margin-bottom: .75em


</style>
