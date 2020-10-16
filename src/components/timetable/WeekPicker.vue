<template>
  <div class="week-picker">
    <ButtonGroup :default-index="defaultWeek" :values="weeks" @change="select"></ButtonGroup>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import ButtonGroup, {ButtonGroupValue} from "@/components/common/ButtonGroup.vue";

@Component({
  name: 'WeekPicker',
  components: {ButtonGroup}
})
export default class WeekPicker extends Vue {
  @Prop({required: false}) defaultWeek?: number;
  weeks = ['Верхняя', 'Нижняя'];
  selectedIndex: number | null = null;

  mounted() {
    this.selectedIndex = this.defaultWeek ?? 0;
  }

  select({index, value}: ButtonGroupValue) {
    this.selectedIndex = index;
    this.$emit('change', {index, value});
  }
}
</script>

<style scoped>

</style>
