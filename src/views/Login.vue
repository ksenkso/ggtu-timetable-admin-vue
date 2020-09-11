<template>
  <div class="login-window">
    <h1>Расписание ГГТУ</h1>
    <h2>Вход</h2>
    <Form @submit="onFormSubmit" send-button-text="Вход" :is-loading="isLoading" class="form_page-login">
      <Field label="Логин" name="login"></Field>
      <Field type="password" label="Пароль" name="password"></Field>
      <template slot="submit">
        <Button type="submit" class="button_block" theme="primary" :disabled="isLoading">Войти</Button>
      </template>
    </Form>
  </div>
</template>

<script>

import {api} from '../api';
import Field from '@/components/forms/Field.vue';
import Form from '@/components/forms/Form.vue';
import Button from "@/components/common/Button.vue";

export default {
  name: 'Login',
  components: {Field, Form, Button},
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
          console.log('logged in')
          this.$router.push({path: '/'})
        })
        .catch((error) => {
          console.log(error)
          this.isLoading = false;
          this.error = error;
        })
    }
  }
}
</script>

<style scoped lang="sass">
@import "../assets/functions"
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

.form_page-login
  display: flex
  flex-direction: column
</style>
