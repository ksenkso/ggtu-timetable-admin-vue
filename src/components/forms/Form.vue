<template>
  <form action="#" @submit.prevent="onSubmit" class="form">
    <div class="form__fields">
      <slot></slot>
    </div>
    <div class="form__buttons">
      <slot name="submit" :disabled="isLoading">
        <Button type="submit" theme="primary" :disabled="isLoading">{{ sendButtonText }}</Button>
      </slot>
    </div>
  </form>
</template>

<script>
import Button from '@/components/common/Button.vue';

export default {
  name: 'Form',
  components: {Button},
  props: {
    sendButtonText: {
      type: String,
      default: 'Отправить'
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onSubmit() {
      const data = {};
      this.$slots.default?.forEach(node => {
        const name = node.componentInstance.$options.name
        if (name === 'Field') {
          data[node.componentInstance?.$props.name] = node.componentInstance?.$data.value;
        }
      });
      this.$emit('submit', data);
    }
  }
}
</script>

<style scoped lang="sass">
.form
  &__buttons
    margin-top: 1em

</style>
