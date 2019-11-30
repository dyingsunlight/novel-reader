<template>
  <div class="uk-container uk-container-small">
    <PreferenceComponent></PreferenceComponent>
  </div>
</template>

<script lang="ts">
import PreferenceComponent from './components/preference.vue'

export default {
  name: 'App',
  components: {
    PreferenceComponent
  },
  data() {
    return {}
  },
}

</script>
