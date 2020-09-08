<template>
  <header class="header">
    <h1>Расписание ГГТУ</h1>
  </header>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style scoped lang="sass">
@import "../../assets/functions"
.header
  grid-area: header
  background-color: theme-color("primary")
  h1
    margin: 0 0 0 .5em
    color: white
</style>
