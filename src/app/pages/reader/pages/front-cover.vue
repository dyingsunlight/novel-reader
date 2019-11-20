<template>
<div class="collection uk-flex uk-flex-column uk-section">
  <button @click="handleGotoCollection" class="uk-button uk-button-default"> < Collection </button>
  <h3 class="uk-text-center uk-text-bold">
    {{ title }}
  </h3>
  <div>
    <ul>
      <li>
        Author: <span> {{ authors }} </span>
      </li>
      <li>
        From: <a :href="source" target="_blank"> {{ source }} </a>
      </li>
    </ul>

  </div>
  <hr>
  <p>
    {{ description }}
  </p>
  <hr>
  <div>
    <h4> Catalog </h4>
    <CatalogItemComponent
        v-for="item in catalog"
        :item="item"
        @goto="handleOpenReader"
    ></CatalogItemComponent>
  </div>
  <LoadingComponent v-if="isLoading"></LoadingComponent>
</div>
</template>

<script lang="ts">
import { Store } from 'vuex'
import { createComponent, computed, ref, reactive, onMounted } from '@vue/composition-api'
import { Store as AppStore } from "../local-model"
import UIkit from 'app/uikit'
import Router from 'vue-router'
import { Services } from "app/app-model"
import CatalogItemComponent from '../components/catalog-item.vue'
import LoadingComponent from '../components/loading.vue'
import { Resolver } from 'app/services'

export default createComponent({
  name: "front-cover",
  components: {
    CatalogItemComponent,
    LoadingComponent
  },
  props: {
    id: {
      type: String,
      default: null,
      required: true
    }
  },
  setup(props, context) {
    const isLoading = ref(false)
    const store = context.root.$store as Store<AppStore>
    const router = context.root.$router as Router

    onMounted(async () => {
      if (!props.id) {
        await UIkit.modal.alert('Invalid collection, please check whether this url was supported or add it to collection first!')
        router.push('/collection')
      }
    })

    const isReady = computed(() => <boolean>store.getters['collection/isReady'] )
    const collection = computed(() => <Services.ResolvedMeta | void>store.getters['collection/items'].find(item => item.id === props.id))

    const title = computed(() => (collection.value && collection.value.title) || '')
    const catalog = computed(() => (collection.value && collection.value.contents) || [])
    const authors = computed(() => (collection.value && collection.value.authors.join('/')) || [])
    const source = computed(() => (collection.value && collection.value.url))
    const description = computed(() => (collection.value && collection.value.description))

    const resolver = new Resolver()

    const handleOpenReader = async (url: string) => {
      isLoading.value = true
      const content = await resolver.getChapter(url)
      store.commit('reader/fullText', content)
      router.push({ path: '/reader'})
      isLoading.value = false
    }
    const handleGotoCollection = () => {
      router.push({ path: '/collection'})
    }

    return {
      description,
      isReady,
      source,
      catalog,
      title,
      authors,

      isLoading,
      handleOpenReader,
      handleGotoCollection
    }
  }
})
</script>

<style scoped>

</style>
