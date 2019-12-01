<template>
<div class="preference uk-flex uk-flex-column uk-section">
  <div class="preference-title">
    <h1>
      Advance Settings
    </h1>
  </div>
  <div class="uk-margin-top">
    <h4 class="uk-margin-small-bottom"> Proxy </h4>
    <div class="uk-flex uk-form-input">
      <label class="">
        <input class="uk-checkbox" type="checkbox" :checked="preference.proxyIsEnable" @change="preference.proxyIsEnable = $event.target.checked">
        Enable Proxy
      </label>
    </div>
    <div class="uk-flex uk-width-1-1 uk-margin-small-top uk-flex-stretch">
      <label class="uk-form-input uk-text-small uk-margin-small-right" style="width: 80px">
        Protocol
        <input class="uk-input uk-margin-small-top"
               :disabled="!preference.proxyIsEnable"
               style="width: 80px"
               :value="preference.proxyProtocol"
               @blur="preference.proxyProtocol = $event.target.value"
               placeholder="Protocol">
      </label>
      <label class="uk-form-input uk-width-1-1 uk-margin-small-right uk-text-small">
        Host
        <input class="uk-input uk-margin-small-top"
               :disabled="!preference.proxyIsEnable"
               :value="preference.proxyHost"
               @blur="preference.proxyHost = $event.target.value"
               placeholder="Host">
      </label>
      <label class="uk-form-input uk-text-small">
        Port
        <input class="uk-input uk-margin-small-top"
               style="width: 80px"
               :disabled="!preference.proxyIsEnable"
               :value="preference.proxyPort"
               @blur="preference.proxyPort = $event.target.value"
               placeholder="Port">
      </label>
    </div>
    <div class="uk-flex uk-margin-small-top">
      <div class="uk-flex uk-flex-middle uk-width-1-1">
        <label class="uk-form-input uk-margin-small-right uk-text-small">
          Username
          <input class="uk-input uk-margin-small-top uk-width-1-1"
                 :disabled="!preference.proxyIsEnable"
                 :value="preference.proxyUsername"
                 @blur="preference.proxyUsername = $event.target.value"
          >
        </label>
        <label class="uk-form-input uk-text-small">
          Password
          <input type="password" class="uk-input uk-margin-small-top"
                 :disabled="!preference.proxyIsEnable"
                 :value="preference.proxyPassword"
                 @blur="preference.proxyPassword = $event.target.value">
        </label>
      </div>
    </div>

    <div class="uk-margin-top">
      <button class="uk-button uk-button-primary uk-width-1-1" @click="applyChanges" :disabled="!isDirty"> Apply </button>
      <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-top" @click="closeWindow"> Close </button>

    </div>
  </div>

  <hr>
</div>
</template>

<style scoped>

.preference {
  height: 100vh;
  overflow: hidden;
}

.preference-title {
  padding-top: 8px;
  padding-bottom: 8px;

}

</style>

<script lang="ts">
import { isEqual } from 'lodash'
import * as privateIPC from 'app/services/electron/electron-preference'
import { Store } from 'vuex'
import { createComponent, watch, ref, computed } from '@vue/composition-api'
import { Store as AppStore, ElectronPreference } from '../local-model'

export default createComponent({
  components: {
  },
  name: 'preference',
  setup(props, context) {

    const store = context.root.$store as Store<AppStore>
    let preference = ref<ElectronPreference>({})
    const isDirty = computed(() => !isEqual(preferenceSnapshot.value, preference.value))
    const preferenceSnapshot = computed(() => store.getters['electronPreference/snapshot'])

    watch(() => store.getters['electronPreference/snapshot'], (newValue) => {
      preference.value = JSON.parse(JSON.stringify(newValue))
    }, { deep: true})

    watch(() => preferenceSnapshot.value, isReady => {
      if (isReady) {
        preference.value = JSON.parse(JSON.stringify(preferenceSnapshot.value))
      }
    }, { deep: true })



    const applyChanges = () => {
      if (isDirty.value) {
        store.commit('electronPreference/update', preference.value)
        privateIPC.update(preference.value)
      }
    }

    const closeWindow = () => {
      if (isDirty.value) {
        if (!confirm('Deprecate current changed ?')) {
          return
        }
      }
      window.close()
    }

    return {
      isDirty,
      applyChanges,
      closeWindow,
      preference
    }
  },
})

</script>
