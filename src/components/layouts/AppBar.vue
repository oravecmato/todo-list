<script setup lang="ts">
import {useFakeAuth} from "../../composables/useFakeAuth";

const {signOutForever} = useFakeAuth()
</script>
<template>
  <v-app-bar
      color="teal-darken-4"
      image="https://picsum.photos/1920/1080?random"
      density="compact"
      app
  >
    <template v-slot:image>
      <v-img
          gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
      ></v-img>
    </template>

    <v-app-bar-title class="text-left">
      <router-link :to="{name: 'home'}">To-Do App</router-link>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn icon @click="signOutForever">
      <v-icon>mdi-export</v-icon>
      <v-tooltip
          activator="parent"
          location="bottom"
      >Log out permanently</v-tooltip>
    </v-btn>

  </v-app-bar>
</template>