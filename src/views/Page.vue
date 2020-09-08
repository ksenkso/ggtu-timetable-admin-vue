<template>
  <div class="page">
    <NavBar></NavBar>
    <Header></Header>
    <div class="page__content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import NavBar from "@/components/nav/NavBar.vue";
import Header from "@/components/common/Header.vue";

export default {
  name: 'Page',
  components: {NavBar, Header}
}
</script>

<style scoped lang="sass">
.page
  display: grid
  grid-template-rows: 48px 1fr
  grid-template-columns: 220px 1fr
  grid-template-areas: "header header" "sidebar content"
  grid-column-gap: 4px
  grid-row-gap: 4px
  &__content
    grid-area: content
</style>
