<template>
  <div :class="className">
    <h2 class="card__header">
      <slot name="header"></slot>
    </h2>
    <div class="card__content">
      <slot></slot>
    </div>
    <div class="card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Prop } from 'vue-property-decorator';

@Component({
  name: 'Card'
})
export default class Card extends Vue {
  @Prop() theme?: string;

  get className() {
    const classes = ['card'];
    if (this.theme) {
      classes.push(`card_theme-${this.theme}`);
    }
    return classes;
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/variables'
@import '../../assets/functions'
.card
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .17)
  border-radius: .3125rem

  &_theme
    @each $mod, $color in $colors
      &-#{$mod}
        background: rgba($color, .3)
        color: #000

        .card__header
          border-color: $color

  &__header
    border-bottom: 1px solid #ddd

  &__header, &__footer
    padding: .5rem 1rem

    &:empty
      display: none

  &__content
    padding: 1em

  &__row
    margin-bottom: 1rem

    &:last-child
      margin-bottom: 0

  &_hover
    transition: box-shadow .3s ease-in-out

    &:hover
      box-shadow: 0 2px 7px 0 rgba(0, 0, 0, .21)

  h1, h2, h3
    margin: 0

  p
    margin-top: .5rem

    &:last-child
      margin-bottom: 0


</style>
