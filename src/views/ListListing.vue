<script setup lang="ts">
import ToDoListCard from "../components/ToDoListCard.vue"
import ConfirmDialog from "../components/ConfirmDialog.vue"
import AddNewListForm from "../components/AddNewListForm.vue"

import {computed, reactive, ref} from "vue";
import type {ToDoList} from "../typings/ToDoList";
import {ToDoListDefinition} from "../typings/ToDoListDefinition";
import {useRouter} from "vue-router";

const todos = ref<ToDoList[]>([
  {
    id: 'abc',
    name: 'My first to do list',
    items: [
      {
        id: '2433gfjk',
        title: 'This must be done first.',
        text: 'Lorem ipsum...',
        completed: false,
        deadline: '2023-04-05'
      }
    ]
  },
  {
    id: 'csd',
    name: 'My second to do list',
    items: [],
  },
  {
    id: 'dfdfd',
    name: 'My third to do list',
    items: []
  },
  {
    id: 'dsffd',
    name: 'My fourth to do list',
    items: [],
  },
])

let removeListDialogOpen = ref<boolean>(false)
let listToDeleteId = ref<string|null>(null)
let removeListDialogKey = ref<number>(Date.now())
let showAddNewForm = ref<boolean>(false)

const showAddNewFormBtnText = computed<string>(() => todos.value.length ? 'Got something else to do?' : 'Create your first To-Do List')

const showRemoveListModal = (listId: string): void => {
  listToDeleteId.value = listId
  removeListDialogOpen.value = true
  removeListDialogKey.value = Date.now()
}

const deleteList = (): void => {
  console.log('List ' + listToDeleteId.value + 'deleted!')
}

const router = useRouter()

const createList = (formData: ToDoListDefinition): void => {
  confirm(`hey you, this is your data: ${JSON.stringify(formData)}`) && router.push({
    name: 'list',
    params: {
      id: 'hchvarn334'
    }
  })
}
</script>
<template>

  <section class="todo-list-listing">
    <v-row>
      <ToDoListCard
          v-for="todo in todos"
          :model-value="todo"
          @@delete="showRemoveListModal"
          :key="todo.id"
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