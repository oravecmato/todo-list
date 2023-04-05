import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// @ts-ignore
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
    plugins: [
        vue(),
        vuetify()
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    }
})