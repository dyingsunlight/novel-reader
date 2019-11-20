<template>
<div class="loading uk-flex uk-flex-center uk-flex-middle">
  <h5> Loading ... </h5>
</div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

export default createComponent({
  name: 'loading',
  setup() {
    return {
    }
  }
})
</script>

<style lang="less" scoped>
.loading {
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(255,255,255, .4);
}
</style>
