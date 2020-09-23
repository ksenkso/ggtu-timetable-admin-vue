<template>
  <div class="day-picker">
    <ButtonGroup :default-index="defaultDay" :values="days" @change="select"></ButtonGroup>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import ButtonGroup, {ButtonGroupValue} from "@/components/common/ButtonGroup.vue";

@Component({
  name: 'DayPicker',
  components: {ButtonGroup}
})
export default class DayPicker extends Vue {
  @Prop({required: false}) defaultDay?: number;
  days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  selectedIndex: number | null = null;

  mounted() {
    this.selectedIndex = this.defaultDay ?? 0;
  }

  select({index, value}: ButtonGroupValue) {
    this.selectedIndex = index;
    this.$emit('change', {index, value});
  }
}
</script>

<style scoped lang="sass">
@import "../../assets/functions"
.day-picker
  &__day
    &_selected
      background-color: theme-color("primary")
</style>
