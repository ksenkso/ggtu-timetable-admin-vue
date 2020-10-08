<template>
  <Page :title="title">

  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Page from '../Page.vue';

@Component({
  name: 'CreatePatch',
  components: { Page }
})
export default class CreatePatch extends Vue {
  get title(): string {
    let title = 'Добавить изменения: ';
    if (this.group) {
      title += `: ${this.group.name}`;
    }
    if (this.isLoading) {
      title += '. Загрузка...'
    }
    return title;
  }
}
</script>

<style scoped>

</style>
