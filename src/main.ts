import { createApp, provide } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import vuetify from "./plugins/vuetify";
import $axios from './services/axios'
import {useFakeAuth} from "./composables/useFakeAuth";
import {AppKeyInjectionKey} from "./symbols";
import Vue3TouchEvents from "vue3-touch-events";

const {appKey} = useFakeAuth()
const app = createApp(App)

const pinia = createPinia()
pinia.use(() => ({ $axios }))

app.use(pinia)
    .use(router)
    .use(vuetify)
    .use(Vue3TouchEvents);

app.provide(AppKeyInjectionKey, appKey)

app.mount('#app')
