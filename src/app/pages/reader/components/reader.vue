<template>
  <div>
    <div class="uk-flex uk-flex-column uk-padding-small">
      <button class="uk-button uk-button-default uk-width-1-1" @click="handleTextareaToggle">
        Toggle Text Editor
      </button>
      <textarea class="uk-textarea uk-height-medium"
                v-if="isTextEditorOpened"
                :value="fullText"
                @blur="handleTextInput($event.target.value)"></textarea>
    </div>

    <div class="uk-margin-medium-top">
      <div class="uk-flex uk-flex-column uk-flex-right uk-text-bold" style="min-height: 150px">
        <span> {{ untranslatedTexts[indicator] }} </span>
      </div>
      <hr>
      <div class="uk-flex uk-flex-column uk-flex-left" style="min-height: 150px">
        {{ translatedTexts[indicator] }}
      </div>
    </div>

    <div class="uk-flex uk-flex-wrap uk-margin-small-top uk-flex-center">

      <button class="uk-button uk-button-default uk-button-large uk-width-2-5 uk-margin-small-right" @click="prevIndicator()">
        Prev
      </button>
      <button class="uk-button uk-button-default uk-button-large uk-width-2-5" @click="nextIndicator()">
        Next
      </button>
      <button class="uk-button uk-button-default uk-button-large uk-width-1-1@s uk-margin-small-top"
              @click="audio(indicator)"> Speaking
      </button>
    </div>

    <div class="uk-margin-small-top uk-margin-small-bottom uk-text-muted uk-flex uk-flex-middle">
      Total: {{ maxIndicator }}, Current
      <label class="uk-form-controls uk-margin-small-left">
        <input class="uk-input"
               :value="indicator"
               @blur="gotoIndicator($event.target.value)"
               @keydown.enter = "gotoIndicator($event.target.value)"
               type="number"
               :max="maxIndicator"
               :min="minIndicator" step="1">
      </label>
    </div>
  </div>
</template>

<script lang="ts">

import { Store } from 'vuex'
import { createComponent, ref, onBeforeMount, computed, watch } from '@vue/composition-api'
import { ExtendedPromiseAll} from "shared/utils"
import { Translation} from "app/services"
import {PreferenceState, Store as AppStore} from "app/app-model"


const PRELOAD_RANGE_THRESHOLD = 10
const PRELOAD_RANGE = 20

export default createComponent({
  name: 'reader',
  setup(props, context) {
    let isTextEditorOpened = ref(true)
    let isSupportBrowserSpeaking = ref(false)
    const translator = new Translation()

    if ('speechSynthesis' in window) {
      isSupportBrowserSpeaking.value = true
    }

    const store = context.root.$store as Store<AppStore>

    const isReady = computed(() => {
      return store.getters['preference/isReady'] && store.getters['reader/isReady']
    })
    const fullText =  computed<number>(() => store.getters['reader/fullText'])
    const textSizes = computed<number>(() => store.getters['reader/size'])
    const indicator = computed<number>(() => store.getters['reader/indicator'])
    const translatedTexts = computed<string[]>(() => store.getters['reader/translatedTexts'])
    const untranslatedTexts = computed<string[]>(() => store.getters['reader/untranslatedTexts'])
    const preference = computed<PreferenceState>(() => store.state.preference)
    const maxIndicator = computed(() => Math.max(textSizes.value - 1, 0))
    const minIndicator = ref(0)

    const translate = async (toIndicator: number, engine: string = 'youdao') => {
      const downRangeThreshold = Math.max(0, toIndicator - PRELOAD_RANGE_THRESHOLD)
      const upRangeThreshold = Math.min(textSizes.value, toIndicator + PRELOAD_RANGE_THRESHOLD)

      let isRequiredFurtherPreload = false
      for (let i = downRangeThreshold; i < upRangeThreshold; i++) {
        if (isRequiredFurtherPreload) continue
        if (!translatedTexts.value[i]) {
          isRequiredFurtherPreload = true
        }
      }
      const downRange = Math.max(0, downRangeThreshold - (isRequiredFurtherPreload ? PRELOAD_RANGE : 0))
      const upRange = Math.min(textSizes.value, upRangeThreshold + (isRequiredFurtherPreload ? PRELOAD_RANGE : 0))

      const jobs = []
      const translator = new Translation({ engine})
      for (let i = downRange; i < upRange; i++) {
        if (translatedTexts.value[i]) continue
        const text = untranslatedTexts.value[i]
        jobs.push(async () => {
          store.commit('reader/translatedText',  { indicator: i, text: await translator.translate(text, engine)})
        })
      }
      if (jobs.length) {
        await ExtendedPromiseAll(jobs)
      }
    }
    const audio = async (indicator: number) => {
      const text = untranslatedTexts[indicator]
      if (!text) return
      if (preference.value.speakingEngine === 'baidu' || !isSupportBrowserSpeaking) {
        const url = await translator.audio(text)
        const audio = new Audio(url)
        audio.play()
      } else {
        const msg = new SpeechSynthesisUtterance(text);
        msg.voice = speechSynthesis.getVoices().filter((voice) =>  voice.lang === 'ja-JP')[0]
        msg.lang = 'ja-JP'
        msg.rate = Number(preference.value.speakingRate) || 1
        msg.pitch = Number(preference.value.speakingPitch) || 1
        speechSynthesis.speak(msg);
      }
  }

    const nextIndicator = () => {
      store.commit('reader/indicator', Math.min(indicator.value + 1, maxIndicator.value))
    }
    const prevIndicator = () => {
      store.commit('reader/indicator', Math.max(indicator.value - 1, 0))
    }
    const gotoIndicator = (toIndicator) => {
      store.commit('reader/indicator', Number(toIndicator))
    }

    watch(() => isReady.value || indicator.value || fullText.value , () => {
      if (isReady.value) {
        return translate(indicator.value, preference.value.translationEngine)
      }
    })

    const handleTextInput = text => {
      store.commit('reader/fullText', text)
    }
    const handleTextareaToggle = () => {
      isTextEditorOpened.value = !isTextEditorOpened.value
    }

    return {
      nextIndicator,
      prevIndicator,
      gotoIndicator,

      audio,
      translate,

      maxIndicator,
      minIndicator,
      indicator,
      isTextEditorOpened,
      fullText,
      untranslatedTexts,
      translatedTexts,

      handleTextInput,
      handleTextareaToggle
    }
  }
})
</script>
