<template>
  <div class="mock-lesson">
    <Alert theme="warning">
      Пары нет
      <Button @click.native="$emit('set', index)" theme="warning">Поставить пару</Button>
    </Alert>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
  name: 'MockLesson'
})
export default class MockLesson extends Vue {
  @Prop({ required: true }) index!: number;

}
</script>

<style scoped lang="sass">
.button
  margin-left: auto
</style>
