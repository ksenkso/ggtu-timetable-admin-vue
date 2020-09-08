<template>
  <div class="menu">
    <router-link
        class="menu__link"
        active-class="menu__link_active"
        :to="item.link"
        v-for="item in items"
        :key="item.name"
    >
      <span class="menu__label">
        {{ item.text }}
      </span>
    </router-link>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

export type MenuItem = {
  link: string;
  text: string;
}

@Component({
  name: 'Menu'
})
export default class Menu extends Vue {
  @Prop({required: true, default: () => []})
  items!: MenuItem[];
}
</script>

<style scoped lang="sass">
@import "../../assets/functions"
@import "../../assets/mixins"
.menu
  &__label
    position: relative
  &__link
    text-decoration: none
    display: block
    padding: .3em 1em
    width: 100%
    transition: background-color .1s ease-in-out
    color: theme-color("gray")
    &:hover, &_active
      .menu__label
        +underline

</style>
