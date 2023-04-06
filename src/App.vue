<script setup>
import AppRoot from "./components/layouts/AppRoot.vue"
import {inject} from "vue";
import {AppKeyInjectionKey} from "@/symbols";

const appKey = inject(AppKeyInjectionKey)
</script>

<template>

  <v-app app>
  <Suspense>

    <AppRoot :key="appKey" />

    <template #fallback>

      <v-overlay
          :model-value="true"
          class="align-center justify-center"
      >
        <v-progress-circular
            color="primary"
            indeterminate
            size="64"
        ></v-progress-circular>
      </v-overlay>

    </template>

  </Suspense>

  </v-app>

</template>

<style lang="sass">
@import "./assets/scss/index.scss"
</style>
