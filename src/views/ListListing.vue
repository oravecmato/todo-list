<script setup lang="ts">
import ToDoListCard from "../components/ToDoListCard.vue"
import ConfirmDialog from "../components/ConfirmDialog.vue"
import SwiperMenu from "../components/SwiperMenu.vue";
import AddNewListForm from "../components/AddNewListForm.vue"
import {computed, ref} from "vue";
import {ToDoListDefinition} from "../typings/ToDoListDefinition";
import {useRouter} from "vue-router";
import {useToDoListStore} from "../stores/ToDoList";

const store = useToDoListStore()
const router = useRouter()

// Local state

let removeListDialogOpen = ref<boolean>(false)
let listToDeleteId = ref<string|null>(null)
let removeListDialogKey = ref<number>(Date.now())
let showAddNewForm = ref<boolean>(false)

// Mapping store and defining computed variables

const toDoLists = store.toDoLists
const showAddNewFormBtnText = computed<string>(() => toDoLists.length ? 'Got something else to do?' : 'Create your first To-Do List')

// Methods

const showRemoveListModal = (listId: string): void => {
  listToDeleteId.value = listId
  removeListDialogOpen.value = true
  removeListDialogKey.value = Date.now()
}

const deleteList = (): void => {
  store.removeToDoList(listToDeleteId.value!)
}

const createList = (formData: ToDoListDefinition): void => {
  store.storeList(formData).then(id => router.push({
    name: 'list',
    params: {
      id: id
    }
  }))
}
</script>
<template>

  <section style="border: blueviolet 1px dashed; padding: 20px;">
    <SwiperMenu />
  </section>

  <section class="todo-list-listing">
    <h1 class="text-h3 mb-8">My ToDo Lists</h1>
    <hr class="mb-8">

    <v-row>
      <ToDoListCard
          v-for="list in toDoLists"
          :model-value="list"
          @@delete="showRemoveListModal"
          :key="list.id"
      />
    </v-row>
  </section>

  <section class="add-new-list">
    <div
        v-show="!showAddNewForm"
        class="text-center">
      <v-btn
          size="x-large"
          variant="flat"
          color="secondary"
          @click="showAddNewForm = true"
          v-text="showAddNewFormBtnText"
      />
    </div>

    <AddNewListForm
        v-if="showAddNewForm"
        @@submit="createList"
    />

  </section>

  <ConfirmDialog
      question="Do you really want to delete the selected TODO list?"
      :open="removeListDialogOpen"
      @@confirm="deleteList"
      :key="removeListDialogKey"
  />
</template>