import {translator} from 'platforms/services'

export default {
  async translate(params, options) {
    return translator(params, options)
  }
}
