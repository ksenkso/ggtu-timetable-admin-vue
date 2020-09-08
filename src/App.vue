<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="sass">
@import "node_modules/normalize-scss/sass/normalize/import-now"
#app
  height: 100%
html, body
  font-family: Tahoma, Arial, sans-serif
  font-size: 16px
  line-height: 1.667
  height: 100vh
*
  box-sizing: border-box
</style>
