import LoginComponent from './components/login.vue'
import RegisterComponent from './components/register.vue'
import { RouteConfig } from 'vue-router'

export default <RouteConfig[]>[
  { path: '/', component: LoginComponent },
  { path: '/login', component: LoginComponent },
  { path: '/register', component: RegisterComponent },
]
