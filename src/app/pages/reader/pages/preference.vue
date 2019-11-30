<template>
  <div class="uk-section">

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

    <div class="uk-margin-top">
      <button class="uk-button uk-button-primary uk-width-1-1" @click="applyChanges" :disabled="!isDirty"> Apply </button>
      <button @click="handleGoBack" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-top"> < Back </button>
    </div>
  </div>
</template>

<script lang="ts">
import { isEqual } from 'lodash'
import { Store } from 'vuex'
import Router from 'vue-router'
import { createComponent, ref, watch, computed } from '@vue/composition-api'
import { PreferenceState, Store as AppStore } from "../local-model"

export default createComponent({
  name: 'preference',
  setup(props, context) {
    const store = context.root.$store as Store<AppStore>
    const router = context.root.$router as Router

    const preference = ref<PreferenceState>({})
    const preferenceSnapshot = computed(() => store.getters['preference/snapshot'])
    const isDirty = computed(() => !isEqual(preferenceSnapshot.value, preference.value))

    watch(() => store.getters['preference/snapshot'], (newValue) => {
      preference.value = newValue
    })

    watch(() => preferenceSnapshot.value, isReady => {
      if (isReady) {
        preference.value = JSON.parse(JSON.stringify(preferenceSnapshot.value))
      }
    }, { deep: true })

    const handleGoBack = () => {
      router.go(-1)
    }

    const applyChanges = () => {
      if (!isEqual(preferenceSnapshot, preference.value)) {
        store.commit('preference/update', preference.value)
      }
    }

    return {
      preference,
      applyChanges,
      isDirty,
      handleGoBack
    }
  },
})

</script>
