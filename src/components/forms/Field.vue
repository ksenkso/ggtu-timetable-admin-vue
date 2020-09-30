<template>
  <div :class="className">
    <slot name="label">
      <label :for="id" class="form__label">{{ label }}</label>
    </slot>
    <slot name="input" :updateValue="updateValue" :disabled="disabled" :readonly="readonly" :value="value">
      <input
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

<script>
export default {
  name: 'Field',
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      required: false,
    },
    initialValue: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      value: this.initialValue,
    }
  },
  computed: {
    id() {
      return `${this.name}_${this.$vnode.tag}`;
    },
    className() {
      return `form__field${this.inline ? ' form__field_inline' : ''}`
    },
  },
  methods: {
    updateValue(newValue) {
      this.value = newValue;
    },
  },
  mounted() {
    if (this.initialValue !== undefined) {
      this.updateValue(this.value);
    }
  }
}
</script>

<style lang="sass">
@import "../../assets/functions"
.form
  &__field
    margin-bottom: 1rem
    width: 100%

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
