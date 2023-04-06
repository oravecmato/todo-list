<script setup lang="ts">
import ToDoItemListing from "../components/ToDoItemListing.vue"
import AddNewItemForm from "../components/AddNewItemForm.vue"
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import {ToDoList} from "../typings/ToDoList";
import {useToDoListStore} from "../stores/ToDoList";
import {useRouter} from "vue-router";
import {ToDoItemDefinition} from "../typings/ToDoItemDefinition";

const {listId} = defineProps<{
  listId: string
}>()

const AddItemFormKey = ref<number>(new Date().getTime())

const store = useToDoListStore()
const router = useRouter()

const deselect = store.selectList(listId)
if (!store.toDoListId)
  router.push({name: 'home'})

const addItem = async (formData: ToDoItemDefinition): Promise<void> => {
  try {
    await store.storeToDoItem(formData)
    nextTick(() => {
      scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })

    AddItemFormKey.value = new Date().getTime()
  } catch(error: any) {}

}

onUnmounted(() => deselect)

</script>
<template>
  <v-breadcrumbs :items="[{title: 'My ToDo Lists', to: {name: 'home'}}, store.toDoList ? store.toDoList.name : '']" />
  <div class="text-left">
    <h1 class="text-h3 text-left">
      {{ store.toDoList ? store.toDoList.name : '' }}
    </h1>
    <p>
      <small>To Do List</small>
    </p>
  </div>

  <ToDoItemListing  />

  <AddNewItemForm @@submit="addItem" :key="AddItemFormKey" />

</template>