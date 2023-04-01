<script setup lang="ts">
import { ref } from 'vue'
import axios from "axios";

defineProps<{ msg: string }>()

const count = ref(0)
const apiEndpoint: string = import.meta.env.VITE_FIREBASE_REALTIME_DATABASE_API_ENDPOINT
const apiKey: string = import.meta.env.VITE_FIREBASE_REALTIME_DATABASE_API_KEY

  const firebaseRequest = (): void => {
    const collection = 'todo-lists'
    const url = `${apiEndpoint}${collection}.json?auth=${apiKey}`
    axios.get<Object>(url)
        .then(({data}) => console.log(data))
        .catch((error: any) => console.log(error));

  }

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>

  <p>
    <button @click="firebaseRequest">Request to the Firebase Realtime Database</button>
  </p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
