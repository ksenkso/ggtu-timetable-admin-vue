<template>
  <div class="form__field">
    <slot name="label">
      <label :for="id" class="form__label">{{ label }}</label>
    </slot>
    <slot name="input" :updateValue="updateValue" :disabled="disabled" :readonly="readonly">
      <input :type="type" :name="name" :id="id" class="form__control" v-model="value" :disabled="disabled" :readonly="readonly">
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
  },
  data() {
    return {
      value: null,
    }
  },
  computed: {
    id() {
      return `${this.name}_${this.$vnode.tag}`;
    },
  },
  methods: {
    updateValue(newValue) {
      this.value = newValue;
    }
  }
}
</script>

<style scoped lang="sass">
@import "../assets/variables"
.form
  &__field
    margin-bottom: .5em
    width: 100%
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
    outline-color: scale-color(map-get($colors, "primary"), $lightness: 30%)

</style>
