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
import {TimetableEntryView} from "@/utils/timetables";
import {TimetableFormEmpty} from "@/store/entities/types";
import {TimetableEntryType} from "ggtu-timetable-api-client";

@Component({
  name: 'MockLesson'
})
export default class MockLesson extends Vue implements TimetableEntryView {
  @Prop({required: true}) index!: number;

  getTimetableEntry(): TimetableFormEmpty {
    return {
      id: Math.random() * 0.9,
      type: TimetableEntryType.Empty,
      index: this.index,
    }
  }

}
</script>

<style scoped lang="sass">
.button
  float: right
  vertical-align: middle
</style>
