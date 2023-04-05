<script setup>
import AppBar from "./components/layouts/AppBar.vue"
import Breadcrumbs from "./components/layouts/Breadcrumbs.vue";
import Footer from "./components/layouts/Footer.vue";

import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>

  <v-app app>
    <AppBar />

    <v-main class="fill-height">
      <v-container fluid class="container">

        <Breadcrumbs />

        <router-view />

      </v-container>
    </v-main>

<!--    <Footer />-->
  </v-app>

</template>

<style lang="sass">
@import "./assets/scss/index.scss"
</style>
