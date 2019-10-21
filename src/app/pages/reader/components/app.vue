<template>
  <div class="uk-container uk-container-small">


    <div class="uk-flex uk-flex-column uk-padding-small">
      <button class="uk-button uk-button-default uk-width-1-1" @click="isAddingText = !isAddingText"> Toggle Text Input</button>
      <textarea class="uk-textarea uk-height-medium" v-if="isAddingText" :value="allTexts"
                @blur="allTexts = $event.target.value"></textarea>
    </div>

    <div class="uk-margin-medium-top">
      <div class="uk-flex uk-flex-column uk-flex-right uk-text-bold" style="min-height: 200px">
        <span> {{ textSegments[index] }} </span>
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
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import Vue from 'vue'
  import {Watch} from 'vue-property-decorator'
  import {ExtendedPromiseAll} from "../../../core/utils"
  import PlatformService from '../../../services/platform'

  const preTranslateRange = 5

  @Component({
    components: {}
  })
  export default class LoginPage extends Vue {
    isAddingText = true
    allTexts = ''


    index = 0
    translatedTextSegments: { [key: number]: string[] } = []
    textSegments: { [key: number]: string } = []
    segmentMarkers: { [key: number]: boolean } = []

    get currentTranslatedText() {
      const texts = this.translatedTextSegments[this.index]
      if (!texts) return ''
      return texts.join('\n')
    }

    @Watch('allTexts')
    onTextChanged() {
      this.segmentMarkers = {}
      this.textSegments = this.allTexts.split('\n').filter(Boolean).reduce((prev, item, index) => {
        prev[index] = item
        return prev
      }, {})
      this.index = 0
      this.updateTranslations(0)
    }

    prev() {
      this.index = Math.max(0, this.index - 1)
    }

    next() {
      const keys = Object.keys(this.textSegments)
      this.index = Math.min(Math.max(keys.length - 1, 0), this.index + 1)
    }

    get size() {
      return Object.keys(this.textSegments).length
    }

    async updateTranslations(forIndex: number) {

      const keys = Object.keys(this.textSegments)
      const downRange = Math.max(0, forIndex - preTranslateRange)
      const upRange = Math.min(Math.max(keys.length, 0), forIndex + preTranslateRange)

      const jobs = []
      for (let i = downRange; i < upRange; i++) {
        if (this.segmentMarkers[i]) continue
        const text = this.textSegments[i]
        jobs.push(async () => {
          let isSucceed = false
          let retryTimes = 0
          let data

          while (!isSucceed && retryTimes < 3) {
            try {
              data = await PlatformService.translate(text)
              isSucceed = true
            } catch (e) {
              retryTimes++
            }
          }

          if (!isSucceed || !data) return

          console.log('data', data)
          this.$set(this.translatedTextSegments, i, data.result)
          this.segmentMarkers[i] = true
        })
      }
      if (jobs.length) {
        await ExtendedPromiseAll(jobs)
      }
    }

    @Watch('index')
    async onIndexChanged(newIndex) {
      this.updateTranslations(newIndex)
    }


    async playAudio(forIndex = 0) {
      const text = this.textSegments[forIndex]
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
