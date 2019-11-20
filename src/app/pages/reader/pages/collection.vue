<template>
<div class="collection uk-flex uk-flex-column uk-section">
  <div class="collection-title">
    <h1>
      Collection
    </h1>
  </div>
  <hr>
  <div class="uk-height-1-1 uk-margin-small-top">
    <div v-for="collection in collections">
      <ul class="uk-margin-remove uk-padding-remove">
        <li class="uk-flex uk-flex-middle uk-position-relative uk-flex-between" style="margin-bottom: 40px">
          <span class="collection-title uk-button uk-button-link uk-text-left" @click="handleGotoNovelFrontCover(collection.id)"> {{ collection.title }} </span>
          <span class="collection-introduction uk-text-small uk-text-muted">
            <span>
              {{ collection.authors.join('/') }} / {{ collection.publishers.join('/') }}
            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="collection-bottom-bar">
    <hr />
    <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-top"
            @click="handleOpenCollectionModal"
            type="button">
      New Collection
    </button>
    <div ref="add-collection"
         uk-modal
         data-sel-close="false"
         data-bg-close="false"
         data-esc-close="false">
      <div class="uk-modal-dialog uk-modal-body">
        <h2 class="uk-modal-title">Add Collection</h2>
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">Novel URL</label>
          <div class="uk-form-controls">
            <input class="uk-input" id="form-stacked-text" type="text" placeholder="" :disabled="isFetchingContent" v-model="url" autofocus>
          </div>
        </div>

        <p class="uk-text-right">
          <button class="uk-button uk-button-default" :disabled="isFetchingContent" @click="handleCloseCollectionModal">
            Close
          </button>
          <button class="uk-button uk-button-primary" :disabled="isFetchingContent" @click="fetchContent">
            Fetch
          </button>
        </p>
      </div>
    </div>
    <router-link to="/reader" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-top"> Reader </router-link>
    <router-link to="/preference" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-top"> Preference </router-link>
  </div>
</div>
</template>

<style scoped>

.collection {
  height: 100vh;
  overflow: auto;
  min-height: 500px;
}

.collection .collection-bottom-bar {
  flex-shrink: 0;
}

.collection-title {
  padding-top: 8px;
  padding-bottom: 8px;

}
.collection-introduction {
  position: absolute;
  top: 100%;
  left: 0;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { createComponent, computed, ref, reactive } from '@vue/composition-api'
import { Store as AppStore } from "../local-model"
import { Resolver } from 'app/services'
import UIkit from 'app/uikit'
import Router from 'vue-router'
import { Services } from "app/app-model"
import CatalogItemComponent from '../components/catalog-item.vue'

export default createComponent({
  components: {
    CatalogItemComponent
  },
  name: 'collection',
  setup(props, context) {
    const store = context.root.$store as Store<AppStore>
    const router = context.root.$router as Router

    const url = ref('')
    const resolver = new Resolver()
    const isFetchingContent = ref(false)

    const previewCategory = ref<Services.ResolvedMeta>(null)
    const collections = computed(() => store.getters['collection/items'] as Services.ResolvedMeta[])

    const fetchContent = async () => {
      isFetchingContent.value = true
      try {
        const novelMeta = await resolver.getMeta(url.value)
        store.commit('collection/add', novelMeta)
      }catch (e) {
        toggleCollectionModal(false)
      }

      isFetchingContent.value = false
      toggleCollectionModal(false)
    }

    const toggleCollectionModal = isOpen => {
      const addModalDialog = (<any>context).refs['add-collection']
      if (!addModalDialog) return
      if (isOpen) {
        UIkit.modal(addModalDialog).show()
      } else {
        UIkit.modal(addModalDialog).hide()
      }
    }
    const handleOpenCollectionModal = () => toggleCollectionModal(true)
    const handleCloseCollectionModal = () => toggleCollectionModal(false)

    const toggleCatalogModal = isOpen => {
      const catalogModal = (<any>context).refs['catalog']
      if (!catalogModal) return
      if (isOpen) {
        UIkit.modal(catalogModal).show()
      } else {
        UIkit.modal(catalogModal).hide()
      }
    }
    const handleOpenCatalogModal = () => toggleCatalogModal(true)
    const handleCloseCatalogModal = () => toggleCatalogModal(false)
    const handleCatalogPreviewClick = async (catalog: Services.ResolvedMeta) => {
      previewCategory.value = catalog
      await Vue.nextTick()
      handleOpenCatalogModal()
    }

    const handleGotoNovelFrontCover = (id) => {
      return router.push({path: '/front-cover', query: { id }})
    }

    return {
      collections,
      url,
      isFetchingContent,
      fetchContent,

      handleOpenCollectionModal,
      handleCloseCollectionModal,

      previewCategory,
      handleCloseCatalogModal,
      handleOpenCatalogModal,
      handleCatalogPreviewClick,
      handleGotoNovelFrontCover
    }
  },
})

</script>
