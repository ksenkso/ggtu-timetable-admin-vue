<template>
  <div class="mock-lesson">
    <Alert theme="warning">No lesson here</Alert>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    name: 'MockLesson'
})
export default class MockLesson extends Vue {

}
</script>

<style scoped>

</style>
