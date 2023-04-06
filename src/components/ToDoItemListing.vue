<script setup lang="ts">
import ToDoItemCard from "../components/ToDoItemCard.vue"
import ConfirmDialog from "../components/ConfirmDialog.vue"

import {SelectOption} from "../typings/SelectOption";
import {computed, nextTick, ref} from "vue";
import {TDL_ITEM_FILTER_ACTIVE, TDL_ITEM_FILTER_ALL, TDL_ITEM_FILTER_COMPLETED} from "../constants";
import {VTextField} from "vuetify/components";
import {ToDoItemFilter} from "../typings/ToDoItemFilter";
import {useToDoListStore} from "../stores/ToDoList";

const store = useToDoListStore()
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

const noItemsMsg = computed<string>(() =>  `No items ${store.search ? 'match your search criteria' : (store.activeFilter !== TDL_ITEM_FILTER_ALL ? 'match the selected filter' : 'found, feel free to add some.')} ` + (
store.search && store.activeFilter !== TDL_ITEM_FILTER_ALL && store.toDoItemsFilteredWithFullTextSearch(store.search ?? '', false).length ? `<br />Didn't you forget to remove the "${store.activeFilter}" filter?` : ''))

const search = (e: Event): void => {
  store.useSearchProxy((e.target as HTMLInputElement).value)
}

const hideSearchBox = (): void => {
  showSearchBox.value = false
  store.removeSearchProxy()
}
const hideSearchBoxIfEmpty = (e: Event): void => {
  if (!(e.target as HTMLInputElement)!.value.trim())
    hideSearchBox()
}


const showRemoveItemModal = (itemId: string): void => {
  itemToDeleteId.value = itemId
  removeItemDialogOpen.value = true
  removeItemDialogKey.value = Date.now()
}

const deleteItem = (): void => {
  if (itemToDeleteId.value)
  store.removeToDoItem(itemToDeleteId.value)
}

const setDone = (itemId: string): void => {
  store.setToDoItemDone(itemId)
}

</script>
<template>
  <div class="todo-list-items">
    <div class="todo-list-items__filter" v-show="store.toDoList?.items.length">
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
              v-model="store.activeFilter"
              label="Filter"
              density="comfortable"
              :hide-details="true"
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
                    @keyup="search"
                    @keyup.esc.prevent="hideSearchBox"
                    @blur="hideSearchBoxIfEmpty"
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
            v-for="item in store.toDoItems"
            :model-value="item"
            @@delete="showRemoveItemModal"
            @@done="setDone"
            :key="item.id" />
      </v-row>

      <p v-if="!store.toDoItems.length" class="mt-6">
        <v-alert
            variant="tonal"
            color="info"
        >
          <span style="display: block" v-html="noItemsMsg"></span>
        </v-alert>
      </p>

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