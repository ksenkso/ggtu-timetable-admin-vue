<template>
  <select :name="name" :id="id" @change="onChange" class="form__control">
    <option v-for="(option, index) in options" :key="index" :value="option.value">{{ option.name }}</option>
  </select>
</template>

<script>
export default {
  name: 'Select',
  props: {
    name: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  computed: {
    id() {
      return `${this.name}_${this.$vnode.tag}`;
    }
  },
  mounted() {
    this.$emit('change', {target: {value: this.options[0].value}});
  },
  methods: {
    onChange(event) {
      this.$emit('change', this.options[event.target.selectedIndex].value);
    }
  }
}
</script>

<style scoped>

</style>
