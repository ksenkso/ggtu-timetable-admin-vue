<template>
  <aside class="sidebar">
    <UserInfo></UserInfo>
    <Menu :items="menuItems"></Menu>
  </aside>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Menu, {MenuItem} from "./Menu.vue";
import UserInfo from "./UserInfo.vue";

@Component({
  name: 'NavBar',
  components: {Menu, UserInfo}
})
export default class NavBar extends Vue {
  menuItems: MenuItem[] = [
    {link: '/groups', text: 'Группы'},
    {link: '/teachers', text: 'Учителя'},
  ];
}
</script>

<style scoped lang="sass">
.sidebar
  grid-area: sidebar

</style>
