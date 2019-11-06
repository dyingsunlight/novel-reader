<template>
  <div class="uk-container uk-container-small">


    <div class="uk-flex uk-flex-column uk-padding-small">
      <button class="uk-button uk-button-default uk-width-1-1" @click="isAddingText = !isAddingText"> Toggle Text Input</button>
      <textarea class="uk-textarea uk-height-medium" v-if="isAddingText" :value="allTexts"
                @blur="allTexts = $event.target.value"></textarea>
    </div>

    <div class="uk-margin-medium-top">
      <div class="uk-flex uk-flex-column uk-flex-right uk-text-bold" style="min-height: 200px">
        <span> {{ untranslatedTexts[index] }} </span>
      </div>
      <hr>
      <div class="uk-flex uk-flex-column uk-flex-left" style="min-height: 200px">
        {{ currentTranslatedText }}
      </div>
      <hr>
    </div>

    <div class="uk-margin-small-top uk-text-muted">
      No. {{ index }} / {{ size }}
    </div>

    <div class="uk-flex uk-flex-around">
      <button class="uk-button uk-button-default uk-button-large uk-width-1-4" @click="prev()"> Prev </button>
      <button class="uk-button uk-button-default uk-button-large uk-width-1-4" @click="next()"> Next </button>
      <button class="uk-button uk-button-default uk-button-large uk-width-1-4" @click="playAudio(index)"> Audio </button>
    </div>

    <div class="uk-margin-top">
      <button class="uk-button uk-button-default" > {{ engine }}</button>
      <div uk-dropdown="mode: click">
        <ul class="uk-nav uk-dropdown-nav">
          <li v-for="option in engines"> <a  @click="engine = option">{{ option }} </a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import Vue from 'vue'
  import {Watch} from 'vue-property-decorator'
  import {ExtendedPromiseAll} from "../../../core/utils"
  import PlatformService from '../../../services/platform'

  const preloadRangeThreshold = 5
  const preloadRange = 15

  @Component({
    components: {}
  })
  export default class LoginPage extends Vue {
    isAddingText = true
    allTexts = ''


    index = 0
    translatedTexts: { [key: number]: string } = {}
    untranslatedTexts: { [key: number]: string } = {}
    isTextTranslated: { [key: number]: boolean } = {}

    engine = 'youdao'
    engines = [
      'youdao',
      'google',
      'baidu'
    ]

    get currentTranslatedText() {
      return this.translatedTexts[this.index] || ''
    }

    @Watch('allTexts')
    onTextChanged() {
      this.isTextTranslated = {}
      this.untranslatedTexts = this.allTexts.split('\n').filter(Boolean).reduce((prev, item, index) => {
        prev[index] = item
        return prev
      }, {})
      this.index = 0
      return this.updateTranslations(0)
    }

    prev() {
      this.index = Math.max(0, this.index - 1)
    }

    next() {
      const keys = Object.keys(this.untranslatedTexts)
      this.index = Math.min(Math.max(keys.length - 1, 0), this.index + 1)
    }

    get size() {
      return Object.keys(this.untranslatedTexts).length
    }

    async updateTranslations(forIndex: number) {

      const keys = Object.keys(this.untranslatedTexts)
      const downRangeThreshold = Math.max(0, forIndex - preloadRangeThreshold)
      const upRangeThreshold = Math.min(keys.length, forIndex + preloadRangeThreshold)


      let isRequiredFurtherPreload = false
      for (let i = downRangeThreshold; i < upRangeThreshold; i++) {
        if (isRequiredFurtherPreload) continue
        if (!this.isTextTranslated[i]) {
          isRequiredFurtherPreload = true
        }
      }

      const downRange = Math.max(0, downRangeThreshold - (isRequiredFurtherPreload ? preloadRange : 0))
      const upRange = Math.min(keys.length, upRangeThreshold + (isRequiredFurtherPreload ? preloadRange : 0))

      const jobs = []
      for (let i = downRange; i < upRange; i++) {
        if (this.isTextTranslated[i]) continue
        const text = this.untranslatedTexts[i]
        jobs.push(async () => {
          let data = await PlatformService.translate(text, this.engine)
          this.$set(this.translatedTexts, i, data)
          this.isTextTranslated[i] = true
        })
      }
      if (jobs.length) {
        await ExtendedPromiseAll(jobs)
      }
    }

    @Watch('index')
    async onIndexChanged(newIndex) {
      return this.updateTranslations(newIndex)
    }


    async playAudio(forIndex = 0) {
      const text = this.untranslatedTexts[forIndex]
      // const msg = new SpeechSynthesisUtterance(text);
      // msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google 日本語'; })[0];
      // speechSynthesis.speak(msg);

      // fallback
      if (!text) return
      const url = await PlatformService.audio(text)
      // console.log('url', url)
      const audio = new Audio(url)
      audio.play()
      // console.log('this.audioURL', this.audioURL)
    }

  }

</script>
