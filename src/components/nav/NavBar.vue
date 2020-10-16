<template>
  <aside class="sidebar">
    <UserInfo></UserInfo>
    <Menu></Menu>
  </aside>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Menu from "./Menu.vue";
import UserInfo from "./UserInfo.vue";

@Component({
  name: 'NavBar',
  components: {Menu, UserInfo}
})
export default class NavBar extends Vue {

}
</script>

<style scoped lang="sass">
@import "../../assets/functions"
.sidebar
  grid-area: sidebar
  box-shadow: 2px 0 2px 1px rgba(0, 0, 0, .13)
  height: 100%
</style>
