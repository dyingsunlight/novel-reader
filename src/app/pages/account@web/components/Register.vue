<template>
  <div class="uk-container uk-container-small uk-padding uk-flex uk-flex-middle uk-flex-column">
    <div class="uk-margin uk-width-1-1 uk-width-1-2@m">
      <h2> Register </h2>
      <div class="uk-margin">
        <div class="uk-inline uk-width-1-1">
          <span class="uk-form-icon" uk-icon="icon: info"></span>
          <input :disabled="isLoading" class="uk-input uk-width-1-1" type="text" placeholder="Name (Optional)"
                 v-model="name">
        </div>
      </div>
      <div class="uk-margin">
        <div class="uk-inline uk-width-1-1">
          <span class="uk-form-icon" uk-icon="icon: user"></span>
          <input class="uk-input uk-width-1-1 " type="text" placeholder="Email"
                 :disabled="isLoading"
                 v-model="email">
        </div>
      </div>
      <div class="uk-margin">
        <div class="uk-inline uk-width-1-1">
          <span class="uk-form-icon" uk-icon="icon: user"></span>
          <input class="uk-input uk-width-1-1" type="text" placeholder="Username"
                 v-model="username"
                 :disabled="isLoading">
        </div>
      </div>
      <div class="uk-margin">
        <div class="uk-inline uk-width-1-1">
          <span class="uk-form-icon" uk-icon="icon: lock"></span>
          <input class="uk-input uk-width-1-1" type="password" placeholder="Password"
                 v-model="password1"
                 :disabled="isLoading">
        </div>
      </div>
      <div class="uk-margin-small">
        <div class="uk-inline uk-width-1-1">
          <span class="uk-form-icon" uk-icon="icon: lock"></span>
          <input class="uk-input uk-width-1-1"
                 type="password"
                 placeholder="Confirm Password"
                 v-model="password2"
                 :disabled="isLoading">
        </div>
      </div>

      <button class="uk-button uk-button-primary uk-margin-small uk-width-1-1"
              :disabled="!isValid || isLoading"
              @click="submit()">
        <template v-if="isLoading">
          <span uk-spinner="ratio: 0.6"></span>
        </template>
        <template v-else>
          <span> Submit </span>
        </template>
      </button>
      <router-link to="/"
         class="uk-button uk-button-link uk-margin-small uk-width-1-1">
        Login
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Axios from 'axios'
import UIkit from 'app/uikit'
import { createComponent, computed, ref, reactive } from '@vue/composition-api'

export default createComponent({
  name: 'register',
  setup(props, ctx) {
    const email = ref('')
    const name = ref('')
    const username = ref('')
    const password1 = ref('')
    const password2 = ref('')
    const isLoading = ref(false)

    const isValid = computed(() => {const isEmailValid = email.value.length > 3 && email.value.includes('@')
      const isUsernameValid = username.value.length > 3
      const isPasswordValid = password1.value.length > 8 && password1.value === password2.value
      return isEmailValid && isPasswordValid && isUsernameValid
    })

    const submit = async () => {
      if (!isValid.value) {
        UIkit.alert('Incorrect of register information, check again please!')
        return
      }
      try {
        isLoading.value = true
        await Axios.put('/api/user/register', {
          email: email.value,
          name: name.value,
          username: username.value,
          password: password1.value
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
      await UIkit.alert('Register was succeed')
      window.location.pathname = '/reader/index.html'
    }

    const gotoLogin = () => ctx.emit('login')
    return {
      email,
      name,
      username,
      password1,
      password2,
      isLoading,
      isValid,
      submit,
      gotoLogin
    }
  }
})

</script>
