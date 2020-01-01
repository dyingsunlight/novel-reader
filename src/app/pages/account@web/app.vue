<template>
<div>
  <router-view></router-view>
</div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
export default createComponent({
  name: 'app',
  components: {},
  setup() {
    return {}
  }
})
</script>
