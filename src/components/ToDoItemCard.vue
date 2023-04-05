<script setup lang="ts">
import {useMoment} from "../composables/useMoment";
import {ToDoItem} from "../typings/ToDoItem";
import {computed} from "vue";

const {timeLeftBefore, getTimeLeftEnum} = useMoment()

const {modelValue} = defineProps<{
  modelValue: ToDoItem
}>()

const emit = defineEmits<{
  (e: '@delete', itemId: string): void
  (e: '@done', itemId: string): void
}>()

const askToRemoveItem = (): void => {
  emit('@delete', modelValue.id)
}

let extras = computed<Record<string, any>>(() => (
        modelValue.completed ? {color: 'green'} : {variant: 'tonal'}
    )
);

const getRemainingTimeIcon = computed<string>(() => {
  const type = getTimeLeftEnum(modelValue.deadline)
  switch (type) {
    case 'weeks':
      return 'mdi-calendar-blank'
    case 'days':
      return 'mdi-calendar-alert'
    case 'hours':
      return 'mdi-clock-outline'
    case 'minutes':
      return 'mdi-exclamation-thick'
    case 'passed':
      return 'mdi-thumb-down'
  }
})


const getRemainingTimeColor = computed<string>(() => {
  const type = getTimeLeftEnum(modelValue.deadline)
  switch (type) {
    case 'weeks':
      return '#00E5FF'
    case 'days':
      return '#FFEB3B'
    case 'hours':
      return '#E65100'
    case 'minutes':
    case 'passed':
      return '#FF3D00'
  }
})


</script>
<template>

  <v-col
      cols="12"
      sm="6"
  >
    <v-card
        v-bind="{...extras}"
        class="pa-4 todo-item-card"
    >
      <v-card-text>
        <h3 class="todo-item-card__title">{{ modelValue.title }}</h3>

        <p>
        {{ modelValue.text }}
        </p>

        <p v-if="!modelValue.completed" class="todo-item-card__deadline" :style="{color: getRemainingTimeColor}">
          <v-icon>{{ getRemainingTimeIcon }}</v-icon>
          {{ timeLeftBefore(modelValue.deadline) }}
          <v-tooltip
              activator="parent"
              location="top"
          >{{ modelValue.deadline }}</v-tooltip>
        </p>


      </v-card-text>

      <div v-if="!modelValue.completed">
        <v-btn
            icon
            color="green"
            size="small"
            @click="emit('@done', modelValue.id)"
        >
          <v-icon>mdi-check-bold</v-icon>
        </v-btn>

      </div>

      <v-btn
          icon
          v-if="!modelValue.completed"
          class="remove-card-btn"
          color="red"
          size="x-small"
          variant="tonal"
          @click.stop="askToRemoveItem"
      >
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>

    </v-card>
  </v-col>
</template>