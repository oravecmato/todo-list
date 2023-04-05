<script setup lang="ts">
import CompletedStatus from "./CompletedStatus.vue"

import {ToDoList} from "../typings/ToDoList";
import {computed} from "vue";
import { useRouter } from 'vue-router'

const {modelValue} = defineProps<{
  modelValue: ToDoList
}>()

const progress = computed<number>(() => modelValue.items.length ? (
    modelValue.items.filter(item => item.completed).length / modelValue.items.length
    ) : 0
)

const emit = defineEmits<{
  (e: '@delete', listId: string): void
}>()

const router = useRouter()

const redirectToList = (listId: string): void => {
  router.push({
    name: 'list',
    params: {
      id: listId
    }
  })
}

const askToRemoveList = (): void => {
  emit('@delete', modelValue.id)
}

</script>
<template>
  <v-col
      cols="12"
      sm="6"
      md="4"
  >
    <v-card
        variant="tonal"
        :title="modelValue.name"
        class="pa-4 todo-list-card"
        @click="redirectToList(modelValue.id)"
    >
      <CompletedStatus v-model="progress" />

        <v-btn
            icon
            class="remove-card-btn"
            color="red"
            size="x-small"
            @click.stop="askToRemoveList"
        >
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
    </v-card>
  </v-col>

</template>