import * as translator from 'translation.js'
import * as MD5 from 'md5'
import db from '../database'
import {ExtendedPromiseAll, randomString, joinTextWithMarker} from "shared/utils"

export default {
  async translate(params, {engine = 'youdao', marker = '', to = 'zh-CN'} = {}) {
    
    const untranslatedTexts = (params.text || '').split(marker)
    let translationStatistics: { hash: string, translatedText?: string, fromIndex: number }[] = []
    
    //
    // 1. Check text hash whether was translated
    //
    await ExtendedPromiseAll(untranslatedTexts.map((text, index) => {
      let hash
      if (text !== '') {
        hash = MD5(`${text}:${engine}:${to}`)
      }
      return async () => {
        if (!hash) {
          translationStatistics.push({
            hash: '',
            fromIndex: index,
            translatedText: '',
          })
        }
        const cachedTranslatedText = await db.findTranslationCache(hash)
        if (cachedTranslatedText) {
          translationStatistics.push({
            hash,
            fromIndex: index,
            translatedText: cachedTranslatedText,
          })
        } else {
          translationStatistics.push({
            hash,
            fromIndex: index,
          })
        }
      }
    }), 12)
    
    // Resort to ensure text was consistency
    translationStatistics = translationStatistics.sort((a, b) => a.fromIndex > b.fromIndex ? 1 : -1)
  
    //
    // 2. Retrieve translation using database cache and translation API .
    //
    let translatedTexts = []
    if (translationStatistics.some(text => !text.hasOwnProperty('translatedText'))) {
      
      // 2.1 Some text was not translated, mark all translated text represented by theirs hash value.
      const mappedTextTranslations = translationStatistics.map(text => {
        if (text.hasOwnProperty('translatedText')) {
          return text.hash
        }
        return untranslatedTexts[text.fromIndex]
      })
      
      // 2.2 Create new text split marker to avoid hash conflicting.
      let internalMarker
      while (!internalMarker || mappedTextTranslations.some(text => text.includes(internalMarker))) {
        internalMarker = `${randomString(6, `1234567890`)}`
      }
      const fullText = joinTextWithMarker(mappedTextTranslations, internalMarker)
      const data = await translator[engine].translate({...params, text: fullText})
      translatedTexts = data.result.join('').split(internalMarker)
      
      // 2.3 Ignore promise callback simply create cache for database
      translationStatistics.forEach(({hash, fromIndex}) => db.createTransltionCache(hash, translatedTexts[fromIndex]))
    } else {
      translatedTexts = translationStatistics.map(text => text.translatedText)
    }
    
    //
    // 3. Done
    //
    return joinTextWithMarker(translationStatistics.map((text, index) => {
      let result
      if (!text.hasOwnProperty('translatedText')) {
        result = translatedTexts[text.fromIndex]
      } else {
        result = text.translatedText
      }
      return result
    }), marker)
  }
}
