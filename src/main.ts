import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import vSelect from 'vue-select'
import Maska from 'maska'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'vue-select/dist/vue-select.css'
import 'swiper/css'
import './assets/style.scss'

import 'swiper/css/pagination'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(router)
app.use(Maska)

app.component('v-select', vSelect)
app.component('v-swiper', Swiper)
app.component('v-swiper-slide', SwiperSlide)

app.config.errorHandler = (error) => {
  console.log('global error handler', error)
}

app.mount('#app')
