<template>
  <div class="login-window">
    <h1>Расписание ГГТУ</h1>
    <h2>Вход</h2>
    <Form @submit="onFormSubmit" send-button-text="Вход" :is-loading="isLoading">
      <Field label="Логин" name="login"></Field>
      <Field type="password" label="Пароль" name="password"></Field>
    </Form>
  </div>
</template>

<script>

import {api} from '../api';
import Field from '@/components/Field.vue';
import Form from '@/components/Form.vue';

export default {
  name: 'Login',
  components: {Field, Form},
  data() {
    return {
      login: '',
      password: '',
      error: null,
      isLoading: false,
      options: [
        {name: 'some', value: 1},
        {name: 'text', value: 2},
      ]
    }
  },
  methods: {
    onFormSubmit(data) {
      this.isLoading = true;
      api.auth.login(data.login, data.password)
        .then(() => {
          this.$router.push({path: '/'})
        })
        .catch((error) => {
          this.isLoading = false;
          this.error = error;
        })
    }
  }
}
</script>

<style scoped lang="sass">
@import "../assets/variables"
.login-window
  margin: 20px auto
  max-width: 400px
  width: 100%
  padding: 16px 24px
  border: 1px solid #ccc
  border-radius: 3px
  h1, h2
    text-align: center
    color: map-get($colors, "dark")


</style>
