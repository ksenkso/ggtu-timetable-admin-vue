<template>
  <div class="mock-lesson">
    <Alert theme="warning">
      No lesson here
      <Button @click.native="$emit('set')" theme="warning">Поставить пару</Button>
    </Alert>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component({
  name: 'MockLesson'
})
export default class MockLesson extends Vue {

}
</script>

<style scoped lang="sass">
.button
  float: right
  vertical-align: middle
</style>
