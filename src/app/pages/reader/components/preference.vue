<template>
  <div>
    <div class="uk-margin-top">
      <p class="uk-text-muted uk-margin-small-bottom"> Translation Engine </p>
      <button class="uk-button uk-button-default uk-width-1-1 uk-select"> {{ preference.translationEngine }}</button>
      <div uk-dropdown="mode: click" class="uk-width-1-1">
        <ul class="uk-nav uk-dropdown-nav">
          <li v-for="option in preference.translationEngines"><a class="uk-padding" @click="preference.translationEngine = option">{{ option }} </a></li>
        </ul>
      </div>
    </div>
    <div class="uk-margin-top">
      <p class="uk-text-muted uk-margin-small-bottom"> Speaking Engine </p>
      <div class="uk-margin-small-top uk-flex uk-flex-middle">
        <label class="uk-form-label uk-margin-right">
          <input class="uk-radio" type="radio" value="browser" v-model="preference.speakingEngine">
          Browser
        </label>
        <br>
        <label class="uk-form-label">
          <input class="uk-radio" type="radio" value="baidu" v-model="preference.speakingEngine">
          Baidu
        </label>
      </div>
      <template v-if="preference.speakingEngine === 'browser'">
        <p class="uk-text-muted uk-margin-top uk-margin-remove-bottom"> Speaking Rate </p>
        <div class="uk-margin-small-top uk-flex uk-flex-middle">
          <input class="uk-range uk-width-1-1" type="range" value="1" min="0.75" max="2" step="0.01" v-model="preference.speakingRate">
          <span class="uk-margin-small-left"> {{ Math.round(preference.speakingRate * 100) }}% </span>
        </div>
        <p class="uk-text-muted uk-margin-top uk-margin-remove-bottom"> Speaking Pith </p>
        <div class="uk-margin-small-top uk-flex uk-flex-middle">
          <input class="uk-range uk-width-1-1" type="range" value="1" min="0.75" max="2" step="0.01" v-model="preference.speakingPitch">
          <span class="uk-margin-small-left"> {{ Math.round(preference.speakingPitch * 100) }}% </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Store } from 'vuex'
import { createComponent, ref, watch } from '@vue/composition-api'
import {PreferenceState, Store as AppStore} from "app/app-model"

export default createComponent({
  name: 'preference',
  setup(props, context) {
    const store = context.root.$store as Store<AppStore>
    let preference = ref<PreferenceState>({})

    watch(() => store.getters['preference/snapshot'], (newValue) => {
      preference.value = newValue
    })

    watch(() => store.getters['preference/isReady'], isReady => {
      if (isReady) {
        preference = JSON.parse(JSON.stringify(store.getters['preference/snapshot']))
      }
    }, { deep: true })

    return {
      preference
    }
  },
})

</script>
