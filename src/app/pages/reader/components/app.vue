<template>
  <div class="uk-container uk-container-small">
    <reader-component></reader-component>
    <preference-component></preference-component>
  </div>
</template>

<script lang="ts">
import PreferenceComponent from './preference.vue'
import ReaderComponent from './reader.vue'

export default {
  name: 'App',
  data() {
    return {}
  },
  components: {
    PreferenceComponent,
    ReaderComponent
  }
}

</script>
