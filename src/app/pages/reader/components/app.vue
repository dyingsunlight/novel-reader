<template>
  <div class="uk-container uk-container-small">


    <div class="uk-flex uk-flex-column uk-padding-small">
      <button class="uk-button uk-button-default uk-width-1-1" @click="isTextEditorOpened = !isTextEditorOpened">
        Toggle Text Editor
      </button>
      <textarea class="uk-textarea uk-height-medium"
                v-if="isTextEditorOpened"
                :value="rawText"
                @blur="handleTextInput($event.target.value)"></textarea>
    </div>

    <div class="uk-margin-medium-top">
      <div class="uk-flex uk-flex-column uk-flex-right uk-text-bold" style="min-height: 150px">
        <span> {{ untranslatedTexts[index] }} </span>
      </div>
      <hr>
      <div class="uk-flex uk-flex-column uk-flex-left" style="min-height: 150px">
        {{ currentTranslatedText }}
      </div>
    </div>

    <div class="uk-flex uk-flex-wrap uk-margin-small-top uk-flex-center">

      <button class="uk-button uk-button-default uk-button-large uk-width-2-5 uk-margin-small-right" @click="prev()">
        Prev
      </button>
      <button class="uk-button uk-button-default uk-button-large uk-width-2-5" @click="next()">
        Next
      </button>
      <button class="uk-button uk-button-default uk-button-large uk-width-1-1@s uk-margin-small-top"
              @click="playAudio(index)"> Speaking
      </button>
    </div>

    <div class="uk-margin-small-top uk-margin-small-bottom uk-text-muted uk-flex uk-flex-middle">
      Total: {{ maxIndex }}, Current :
      <label class="uk-form-controls uk-margin-small-left">
        <input class="uk-input"
               :value="index"
               @blur="index = $event.target.value"
               @keydown.enter = "index = $event.target.value"
               type="number"
               :max="maxIndex"
               :min="minIndex" step="1">
      </label>
    </div>

    <div class="uk-margin-top">
      <p class="uk-text-muted uk-margin-small-bottom"> Translation Engine </p>
      <button class="uk-button uk-button-default uk-width-1-1 uk-select"> {{ engine }}</button>
      <div uk-dropdown="mode: click" class="uk-width-1-1">
        <ul class="uk-nav uk-dropdown-nav">
          <li v-for="option in engines"><a class="uk-padding" @click="engine = option">{{ option }} </a></li>
        </ul>
      </div>
    </div>

    <div class="uk-margin-top" v-if="isSupportBrowserSpeaking">
      <p class="uk-text-muted uk-margin-small-bottom"> Speaking Engine </p>
      <div class="uk-margin-small-top uk-flex uk-flex-middle">
        <label class="uk-form-label uk-margin-right">
          <input class="uk-radio" type="radio" id="one" value="browser" v-model="speakingEngine">
          Browser
        </label>
        <br>
        <label class="uk-form-label">
          <input class="uk-radio" type="radio" id="two" value="baidu" v-model="speakingEngine">
          Baidu
        </label>
      </div>
      <template v-if="speakingEngine === 'browser'">
        <p class="uk-text-muted uk-margin-top uk-margin-remove-bottom"> Speaking Rate </p>
        <div class="uk-margin-small-top uk-flex uk-flex-middle">
          <input class="uk-range uk-width-1-1" type="range" value="1" min="0.75" max="2" step="0.01" v-model="speakingRate">
          <span class="uk-margin-small-left"> {{ Math.round(speakingRate * 100) }}% </span>
        </div>
        <p class="uk-text-muted uk-margin-top uk-margin-remove-bottom"> Speaking Pith </p>
        <div class="uk-margin-small-top uk-flex uk-flex-middle">
          <input class="uk-range uk-width-1-1" type="range" value="1" min="0.75" max="2" step="0.01" v-model="speakingPitch">
          <span class="uk-margin-small-left"> {{ Math.round(speakingPitch * 100) }}% </span>
        </div>
      </template>
    </div>

    <div class="uk-margin-large-top">
      <button class="uk-button uk-button-danger uk-width-1-1" @click="clearStateCache"> Clean Session</button>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import {Watch} from 'vue-property-decorator'
import {debounce, ExtendedPromiseAll} from "shared/utils"
import * as StorageConstants from 'app/constants/storage'
import Services from "app/services"


const PRELOAD_RANGE_THRESHOLD = 10
const PRELOAD_RANGE = 20
const CACHE_STATE_LIST = [
  'engine',
  'index',
  'rawText',
]
const Translator = new Services.Translation()
const StateStorage = new Services.LocalStorage(StorageConstants.Names.ReaderState)

@Component({
  components: {},
  created() {
    this.createStateCache = debounce(this.createStateCache.bind(this))
  },
  async mounted() {
    if ('speechSynthesis' in window) {
      this.isSupportBrowserSpeaking = true
    }
    this.isInitializing = true
    await this.restoreStateCache()
    CACHE_STATE_LIST.forEach(stateName => {
      this.$watch(() => this[stateName], this.createStateCache)
    })
    this.isInitializing = false

    await this.updateTranslations(this.index)
  }
})
export default class LoginPage extends Vue {
  isInitializing = true
  isTextEditorOpened = true
  rawText = ''
  index: number = 0
  translatedTexts: { [key: number]: string } = {}
  untranslatedTexts: { [key: number]: string } = {}
  isTextTranslated: { [key: number]: boolean } = {}
  engine = 'youdao'
  engines = [
    'youdao',
    'google',
    'baidu'
  ]

  speakingEngine = 'browser'
  speakingRate = 1
  speakingPitch = 1
  isSpeaking = false
  isSupportBrowserSpeaking = false

  //
  // Computed
  //
  get currentTranslatedText() {
    return this.translatedTexts[this.index] || ''
  }
  get size() {
    return Object.keys(this.untranslatedTexts).length
  }
  get maxIndex() {
    return Math.max(this.size - 1, 0)
  }
  get minIndex() {
    return 0
  }

  //
  //
  //
  @Watch('rawText')
  onTextChanged() {
    this.isTextTranslated = {}
    this.untranslatedTexts = this.rawText.split('\n').filter(Boolean).reduce((prev, item, index) => {
      prev[index] = item
      return prev
    }, {})
  }
  @Watch('index', {immediate: true})
  async onIndexChanged(newIndex) {
    console.log('onIndexChanged updateTranslations', this.index)
    return this.updateTranslations(newIndex)
  }

  handleTextInput(value) {
    this.rawText = value
    console.log('handleTextInput', this.index)
    this.index = 0
  }
  prev() {
    this.index = Math.max(this.minIndex, this.index - 1)
  }
  next() {
    this.index = Math.min(this.maxIndex, this.index + 1)
  }
  async updateTranslations(forIndex: number) {
    const keys = Object.keys(this.untranslatedTexts)
    const downRangeThreshold = Math.max(0, forIndex - PRELOAD_RANGE_THRESHOLD)
    const upRangeThreshold = Math.min(keys.length, forIndex + PRELOAD_RANGE_THRESHOLD)

    let isRequiredFurtherPreload = false
    for (let i = downRangeThreshold; i < upRangeThreshold; i++) {
      if (isRequiredFurtherPreload) continue
      if (!this.isTextTranslated[i]) {
        isRequiredFurtherPreload = true
      }
    }

    const downRange = Math.max(0, downRangeThreshold - (isRequiredFurtherPreload ? PRELOAD_RANGE : 0))
    const upRange = Math.min(keys.length, upRangeThreshold + (isRequiredFurtherPreload ? PRELOAD_RANGE : 0))

    const jobs = []
    for (let i = downRange; i < upRange; i++) {
      if (this.isTextTranslated[i]) continue
      const text = this.untranslatedTexts[i]
      jobs.push(async () => {
        let data = await Translator.translate(text, this.engine)
        this.$set(this.translatedTexts, i, data)
        this.isTextTranslated[i] = true
      })
    }
    if (jobs.length) {
      await ExtendedPromiseAll(jobs)
    }
  }

  async playAudio(forIndex = 0) {
    const text = this.untranslatedTexts[forIndex]
    if (!text) return
    if (this.speakingEngine === 'baidu' || !this.isSupportBrowserSpeaking) {
      const url = await Translator.audio(text)
      const audio = new Audio(url)
      audio.play()
    } else {
      const msg = new SpeechSynthesisUtterance(text);
      msg.voice = speechSynthesis.getVoices().filter((voice) =>  voice.lang === 'ja-JP')[0]
      msg.lang = 'ja-JP'
      msg.rate = Number(this.speakingRate) || 1
      msg.pitch = Number(this.speakingPitch) || 1
      console.log( msg.rate)
      speechSynthesis.speak(msg);
    }
  }

  async restoreStateCache() {
    const cachedState = (await StateStorage.getItem('states')) || ''
    let state = {}
    try {
      state = JSON.parse(cachedState)
    } catch (e) {
      console.log('Failed to restore state form storage.')
    }

    Object.entries(state).forEach(([key, value]) => {
      if (CACHE_STATE_LIST.includes(key)) {
        this.$set(this, key, value)
      }
    })
  }

  async createStateCache() {
    const cache = {}
    CACHE_STATE_LIST.forEach(key => {
      if (typeof this[key] !== 'undefined') {
        cache[key] = this[key]
      }
    })
    await StateStorage.setItem('states', JSON.stringify(cache))
  }

  async clearStateCache() {
    await StateStorage.clear()
    window.alert('Storage Cleaned')
  }
}

</script>
