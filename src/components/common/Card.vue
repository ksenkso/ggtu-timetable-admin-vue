<template>
  <div class="card">
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
import {Component, Vue} from "vue-property-decorator";

@Component({
  name: 'Card'
})
export default class Card extends Vue {

}
</script>

<style scoped lang="sass">
.card
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .13)
  overflow: hidden
  border-radius: .3125rem
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
      box-shadow: 0 2px 7px 0 rgba(0, 0, 0, .17)
  h1, h2, h3
    margin: 0
  p
    margin-top: .5rem
    &:last-child
      margin-bottom: 0


</style>
