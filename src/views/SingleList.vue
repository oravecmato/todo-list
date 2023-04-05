<script setup lang="ts">
import ToDoItemListing from "../components/ToDoItemListing.vue"
import AddNewItemForm from "../components/AddNewItemForm.vue"
import {ref} from "vue";
import {ToDoList} from "../typings/ToDoList";

const list = ref<ToDoList>({
  id: 'abc',
  name: 'My first to do list',
  items: [
    {
      id: '123214sffsd',
      title: 'This must be done first.',
      text: 'Lorem ipsum...',
      completed: false,
      deadline: '23.04.2023 12:00'
    }
  ]
})
</script>
<template>
  <h1 class="text-h3 text-left">
    {{ list.name }}
  </h1>

  <ToDoItemListing  />

  <AddNewItemForm />

</template>