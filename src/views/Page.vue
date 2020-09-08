<template>
  <div class="page">
    <NavBar></NavBar>
    <Header></Header>
    <div class="page__content">
      <h1 class="page__title" v-if="title">{{title}}</h1>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import NavBar from "@/components/nav/NavBar.vue";
import Header from "@/components/common/Header.vue";

export default {
  name: 'Page',
  components: {NavBar, Header},
  props: {
    title: {
      type: String,
      required: false
    }
  }
}
</script>

<style scoped lang="sass">
.page
  display: grid
  grid-template-rows: 48px 1fr
  grid-template-columns: 220px 1fr
  grid-template-areas: "header header" "sidebar content"
  grid-column-gap: 4px
  height: 100%
  &__content
    grid-area: content
    padding: 1em 1.5em

  &__title
    margin: 0
</style>
