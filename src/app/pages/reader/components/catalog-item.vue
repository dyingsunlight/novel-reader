<template>
<div>
  <div class="uk-flex uk-flex-middle uk-flex-between" :class="{ 'uk-margin-top': !item.url}">
    <span v-if="!item.url">
      {{ item.title }}
    </span>
    <a v-else class="uk-flex uk-button-link uk-width-1-1"
       :class="{'uk-text-danger': isVisited}"
       style="padding-bottom: 6px;padding-top: 6px"
       @click="handleClick">
      {{ item.title }}
    </a>
    <span v-if="item.children && item.children.length"
            @click="isExpand =! isExpand">
      <span v-show="!isExpand"> Open </span>
      <span v-show="isExpand"> Close </span>
    </span>
  </div>
  <hr class="uk-margin-remove"/>

  <template v-if="item.children && item.children.length">
    <div class="uk-margin-small-left" v-show="isExpand">
      <catalog-item
          @goto="handleChildrenClicked"
          v-for="(child, index) in item.children"
          :item="child"
      ></catalog-item>
    </div>
  </template>
</div>
</template>

<script lang="ts">
import { createComponent, ref, onBeforeMount, computed, watch } from '@vue/composition-api'
import { Store } from 'vuex'
import { Store as AppStore } from "../local-model"

export default createComponent({
  name: 'catalog-item',
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup(props, context) {
    const isExpand = ref(true)
    const store = context.root.$store as Store<AppStore>
    const visitedLinks = computed(() => store.getters['visitedLink/links'])
    const isVisited = computed(() => visitedLinks.value && visitedLinks.value.some(link => link.id === props.item.url))
    const handleClick = (payload) => {
      store.commit('visitedLink/add', { id: props.item.url , visitedTime: Date.now() })
      context.emit('goto', props.item.url)
    }
    const handleChildrenClicked = (payload) => {
      context.emit('goto', payload)
    }
    return {
      isVisited,
      isExpand,
      visitedLinks,
      handleClick,
      handleChildrenClicked
    }
  }
})
</script>

<style scoped>

</style>
