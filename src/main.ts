import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/index.css'
import App from './App.vue'
import { Toaster } from 'vue-sonner'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
