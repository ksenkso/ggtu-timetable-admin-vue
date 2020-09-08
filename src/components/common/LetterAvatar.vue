<template>
  <div class="letter-avatar">
    <div class="letter-avatar__short">{{letters}}</div>
    <div class="letter-avatar__hint">{{name}}</div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component({
  name: 'LetterAvatar'
})
export default class LetterAvatar extends Vue {
  @Prop({required: true, default: 'A'})
  name!: string

  get letters(): string {
    return this.name[0];
  }
}
</script>

<style scoped lang="sass">
@import "../../assets/functions"
$letter-avatar-size: 32px
@keyframes fade-in
  0%
    opacity: 0
  100%
    opacity: 1
.letter-avatar
  position: relative
  user-select: none
  &__short
    display: inline-block
    width: $letter-avatar-size
    height: $letter-avatar-size
    text-transform: uppercase
    text-align: center
    vertical-align: middle
    line-height: $letter-avatar-size
    color: #ffffff
    background-color: theme-color("primary")
    border-radius: 50%
    font-size: 20px
    &:hover
      + .letter-avatar__hint
        display: block
        opacity: 1

  &__hint
    position: absolute
    display: none
    border-radius: 3px
    padding: 3px
    opacity: 0
    animation: .1s ease-in-out fade-in
    background-color: rgba(0, 0, 0, .8)
    color: #ffffff
    z-index: 9999
    left: 0
    bottom: -($letter-avatar-size + 4px)

</style>
