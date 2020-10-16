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

import { Component, Prop, Vue } from 'vue-property-decorator';
import { VNode } from 'vue';

const walk = (children: VNode[], fields: Vue[]) => {
  children.forEach(node => {
    if (node.componentInstance && node.componentInstance.$options.name === 'Field' && node.componentInstance) {
      fields.push(node.componentInstance);
    } else if (node.children && node.children.length) {
      walk(node.children, fields);
    }
  })
}
@Component({
  name: 'Form',
  components: { Button },
})
export default class Form extends Vue {
  @Prop({ default: 'Отправить' }) sendButtonText!: string;
  @Prop({ default: false }) isLoading!: boolean;
  @Prop({ type: Boolean }) noSubmitButton?: boolean;

  onSubmit() {
    this.$emit('submit', this.getFormData());
  }

  getFormData(): any {
    const data: any = {};
    const fields: Vue[] = [];
    if (this.$slots.default) {
      walk(this.$slots.default, fields);
    }
    fields.forEach(field => {
      if (data[field.$props.name]) {
        data[field.$props.name] = Array.isArray(data[field.$props.name])
            ? data[field.$props.name].concat(field.$data.value)
            : [data[field.$props.name], field.$data.value]
      } else {
        data[field.$props.name] = field.$data.value;
      }
    })
    return data;
  }
}

</script>

<style scoped lang="sass">
.form
  &__buttons
    margin-top: 1em

</style>
