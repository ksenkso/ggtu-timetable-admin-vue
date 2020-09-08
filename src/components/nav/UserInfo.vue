<template>
  <div class="user-info">
    <LetterAvatar :name="user.username"></LetterAvatar>
    <div class="user-info__name">{{user.username}}</div>
    <button @click="logout" class="logout">Выход</button>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {api} from '@/api';
import LetterAvatar from "@/components/common/LetterAvatar.vue";

@Component({
  name: 'UserInfo',
  components: {LetterAvatar}
})
export default class UserInfo extends Vue {
  user = api.auth.user;

  logout() {
    api.auth.logout();
    this.$router.push({name: 'Login'});
  }
}
</script>

<style scoped lang="sass">
@import "../../assets/mixins"

.user-info
  padding: 2em 1em 1em 1em
  display: flex
  align-items: baseline
  &__name
    padding-left: 1em
  .logout
    margin-left: auto
    background-color: #fff
    border: none
    cursor: pointer
    position: relative
    padding: 0
    &:hover, &:active
      +underline
</style>
