<script setup lang="ts">
import ToDoItemCard from "../components/ToDoItemCard.vue"
import ConfirmDialog from "../components/ConfirmDialog.vue"

import {SelectOption} from "../typings/SelectOption";
import {computed, nextTick, ref} from "vue";
import {TDL_ITEM_FILTER_ACTIVE, TDL_ITEM_FILTER_ALL, TDL_ITEM_FILTER_COMPLETED} from "../constants";
import {VTextField} from "vuetify/components";
import {ToDoItem} from "../typings/ToDoItem";

const items: ToDoItem[] = [{
  id: 'adsf122323',
  title: 'This must be done first.',
  text: 'Lorem ipsum...',
  completed: false,
  deadline: '14.3.2023 23:59'
},{
  id: 'afgfsf122323',
  title: 'This must be done second.',
  text: 'Lorem ipsum...',
  completed: false,
  deadline: '09.4.2023'
},{
  id: 'addf122323',
  title: 'This must be done last.',
  text: 'Lorem ipsum...',
  completed: true,
  deadline: '04.6.2023'
}
]

const filterOptions:SelectOption[] = [
  {
    title: 'Active',
    value: TDL_ITEM_FILTER_ACTIVE
  },
  {
    title: 'Completed',
    value: TDL_ITEM_FILTER_COMPLETED
  },
  {
    title: 'All',
    value: TDL_ITEM_FILTER_ALL
  },
]

const filterValue = ref<string|null>(null)
const showSearchBox = ref<boolean>(false)
const searchBoxParent = ref<HTMLDivElement|null>(null)

let removeItemDialogOpen = ref<boolean>(false)
let itemToDeleteId = ref<string|null>(null)
let removeItemDialogKey = ref<number>(Date.now())


const displaySearchBox = (): void => {
  showSearchBox.value = true;
  nextTick(() => {
    const input : HTMLInputElement|null = (searchBoxParent.value as HTMLDivElement).querySelector('input')
    console.log(input)
    if (input)
      setTimeout(() => {
        input.focus()
      }, 400) // wait until the transition ends
  })
}

const search = (e: Event): void => {
  console.log(e.target)
  showSearchBox.value = false
}

const displayedItems = computed<ToDoItem[]>(() => {
  switch (filterValue.value) {
    case TDL_ITEM_FILTER_ACTIVE:
      return items.filter(({deadline, completed}) => !completed && Date.parse(deadline) > Date.parse(new Date().toISOString()))
    case TDL_ITEM_FILTER_COMPLETED:
      return items.filter(({completed}) => completed)
    default:
      return items
  }
})


const showRemoveItemModal = (itemId: string): void => {
  itemToDeleteId.value = itemId
  removeItemDialogOpen.value = true
  removeItemDialogKey.value = Date.now()
}

const deleteItem = (): void => {
  console.log('Item ' + itemToDeleteId.value + 'deleted!')
}

const setDone = (itemId: string): void => {
  alert(itemId)
}


</script>
<template>
  <div class="todo-list-items">
    <div class="todo-list-items__filter">
      <v-row>
        <v-col
            cols="12"
            sm="5"
            md="4"
            class="d-inline-flex align-center"
        >
          <label for="filterSelect">
            Showing:
          </label>
          <v-select
              id="filterSelect"
              :items="filterOptions"
              v-model="filterValue"
              :label="filterValue ? undefined : 'Filter'"
              density="comfortable"
              hide-details="true"
              variant="outlined"
              class="ml-3"
          ></v-select>
        </v-col>
        <v-col
            cols="12"
            sm="7"
            md="8"
            class="text-right d-flex align-center"
        >

          <div
              class="flex-grow-1">
            <Transition name="slide">
              <div
                  v-if="showSearchBox"
                   ref="searchBoxParent"
              >
                <v-text-field
                    variant="outlined"
                    density="comfortable"
                    label="Search in the items"
                    placeholder="Search in the items"
                    append-inner-icon="mdi-magnify"
                    single-line
                    hide-details
                    @click:append-inner="search"
                    @keydown.enter="search"
                    @blur="showSearchBox = false"
                ></v-text-field>
              </div>
            </Transition>
          </div>

          <Transition name="fade">
            <v-btn
                v-show="!showSearchBox"
                icon
                variant="tonal"
                @click="displaySearchBox"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </Transition>
        </v-col>
      </v-row>

    </div>

    <div class="todo-list-items__listing">
      <v-row>
        <ToDoItemCard
            v-for="item in displayedItems"
            :model-value="item"
            @@delete="showRemoveItemModal"
            @@done="setDone"
            :key="item.id" />
      </v-row>
    </div>

  </div>

  <ConfirmDialog
      question="Do you really want to delete the selected TODO item?"
      :open="removeItemDialogOpen"
      @@confirm="deleteItem"
      :key="removeItemDialogKey"
  />

</template>

<style scoped>

</style>