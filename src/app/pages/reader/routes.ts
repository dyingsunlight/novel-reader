import CollectionComponent from './pages/collection.vue'
import ReaderComponent from './pages/reader.vue'
import PreferenceComponent from './pages/preference.vue'
import FrontCoverComponent from './pages/front-cover.vue'
import { RouteConfig } from 'vue-router'

export default <RouteConfig[]>[
  { path: '/', component: CollectionComponent },
  { path: '/collection', component: CollectionComponent },
  { path: '/front-cover', component: FrontCoverComponent, props: (route) => ({ id: route.query.id }) },
  { path: '/preference', component: PreferenceComponent },
  { path: '/reader', component: ReaderComponent }
]
