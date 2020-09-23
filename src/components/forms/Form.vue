<template>
  <form action="#" @submit.prevent="onSubmit" class="form">
    <div class="form__fields">
      <slot></slot>
    </div>
    <div class="form__buttons">
      <slot name="submit" :disabled="isLoading">
        <Button v-if="!noSubmitButton" type="submit" theme="primary" :disabled="isLoading">{{ sendButtonText }}</Button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import Button from '@/components/common/Button.vue';

import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
  name: 'Form',
  components: {Button},
})
export default class Form extends Vue {
  @Prop({default: 'Отправить'}) sendButtonText!: string;
  @Prop({default: false}) isLoading!: boolean;
  @Prop({type: Boolean}) noSubmitButton?: boolean;

  onSubmit() {
    this.$emit('submit', this.getFormData());
  }

  getFormData(): any {
    const data: any = {};
    this.$slots.default!.forEach(node => {
      const name = node.componentInstance!.$options.name
      if (name === 'Field') {
        // if a form already has value with the name of this field,
        // make an array that will contain all values for this name in order
        // that they appear in the DOM
        if (data[node.componentInstance!.$props.name]) {
          data[node.componentInstance?.$props.name] = [data[node.componentInstance?.$props.name], node.componentInstance?.$data.value];
        } else {
          data[node.componentInstance?.$props.name] = node.componentInstance?.$data.value;
        }
      }
    });
    return data;
  }
}

</script>

<style scoped lang="sass">
.form
  &__buttons
    margin-top: 1em

</style>
