<template>
  <div class="uk-container uk-container-small uk-padding uk-flex uk-flex-middle uk-flex-column">
    <div class="uk-margin uk-width-1-1 uk-width-1-2@m">
      <h2> Login </h2>
      <div class="uk-margin-small">
        <div class="uk-inline uk-width-1-1">
          <span class="uk-form-icon" uk-icon="icon: user"></span>
          <input class="uk-input uk-width-1-1" type="text" placeholder="Username" v-model="username" :disable="isLoading">
        </div>
      </div>
      <div class="uk-margin-small">
        <div class="uk-inline uk-width-1-1">
          <span class="uk-form-icon" uk-icon="icon: lock"></span>
          <input class="uk-input uk-width-1-1" type="password" placeholder="Password" v-model="password" :disable="isLoading">
        </div>
      </div>

      <button class="uk-button uk-button-primary uk-margin-small uk-width-1-1" @click="submit" :disable="isLoading">
        Login
      </button>
      <router-link to="/register"
         class="uk-button uk-button-link uk-margin-small uk-width-1-1"> Register </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Axios from 'axios'
import UIkit from 'app/uikit'
import { createComponent, computed, ref, reactive } from '@vue/composition-api'

export default createComponent({
  name: 'login',
  setup(props, ctx) {
    const username = ref('')
    const password = ref('')
    const isLoading = ref(false)

    const isUsernameValid = computed(() => {
      return username.value.length > 2
    })

    const isPasswordValid = computed(() => {
      return password.value.length > 8
    })

    const submit = async () => {
      if (!isUsernameValid.value || !isPasswordValid) {
        UIkit.alert('Invalid Username or Password!')
        return
      }
      try {
        isLoading.value = true
        await Axios.post('/api/user/login', {
          username: username.value,
          password: password.value
        })
        isLoading.value = false
      } catch (e) {
        if (e.status.toString().startsWith('5')) {
          UIkit.alert('Server unavailable now!')
          return
        }
        if (e.status.toString().startsWith('4')) {
          UIkit.alert('Invalid Username or Password!')
          return
        }
      }
      window.location.pathname = '/reader/index.html'
    }

    const gotoRegister = () => {
      ctx.emit('register')
    }

    return {
      username,
      password,
      isLoading,
      submit,
      gotoRegister
    }
  }
})

</script>
