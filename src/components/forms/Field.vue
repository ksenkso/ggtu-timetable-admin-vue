<template>
  <div :class="className">
    <slot name="label">
      <label :for="id" class="form__label">{{ label }}</label>
    </slot>
    <slot name="input" :updateValue="updateValue" :disabled="disabled" :readonly="readonly" :value="value">
      <input
          ref="input"
          class="form__control"
          @input="$emit('input', $event)"
          :type="type"
          :name="name"
          :id="id"
          v-model="value"
          :disabled="disabled"
          :readonly="readonly">
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Prop } from 'vue-property-decorator';
import { Ref } from 'vue-property-decorator';

@Component({
  name: 'Field'
})
export default class Field extends Vue {
  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) label!: string;
  @Prop() type?: string;
  @Prop() disabled?: boolean;
  @Prop() readonly?: boolean;
  @Prop() inline?: boolean;
  @Prop() initialValue?: string;
  @Ref('input') input?: HTMLInputElement;

  data() {
    return {
      value: undefined
    }
  }

  get id() {
    return `${this.name}_${this.$vnode.tag}`;
  }

  get className() {
    return `form__field${this.inline ? ' form__field_inline' : ''}`
  }

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  updateValue(newValue: string | number) {
    (this as any).value = newValue;
  }

  mounted() {
    if (this.initialValue !== undefined) {
      this.updateValue(this.initialValue);
    }
  }
}
</script>

<style lang="sass">
@import "../../assets/functions"
.form
  &__field
    margin: 1rem 0
    width: 100%

    &:first-child
      margin-top: 0

    &_inline
      display: flex

      .form__label
        margin-left: 0
        margin-right: 8px

  &__label
    display: block
    margin-bottom: .1em
    margin-left: 8px

  &__control
    width: 100%
    padding: 6px 8px 2px 8px
    box-sizing: border-box
    border: 1px solid #aaa
    border-radius: 3px
    vertical-align: baseline
    line-height: 1.6
    height: 35px
    outline-color: scale-color(theme-color("primary"), $lightness: 30%)
    background-color: #ffffff

    &[type="date"], &[type="datetime"]
      max-height: 35px
</style>
