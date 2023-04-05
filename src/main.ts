import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import vuetify from "./plugins/vuetify";
import $axios from './services/axios'

const app = createApp(App)

const pinia = createPinia()
pinia.use(() => ({ $axios }))

app.use(pinia)
    .use(router)
    .use(vuetify)

app.mount('#app')
