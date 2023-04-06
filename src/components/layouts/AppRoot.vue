<script setup lang="ts">
import AppBar from "./AppBar.vue"
import {useToDoListStore} from "../../stores/ToDoList";

const store = useToDoListStore()

await store.fetchLists()
</script>
<template>

    <AppBar />

    <v-main class="fill-height">
      <v-container fluid class="container">

        <router-view />

      </v-container>
    </v-main>

</template>