<script setup lang="ts">

import {computed} from "vue";

const {modelValue} = defineProps<{
  modelValue: number|string
}>()

const color = computed<string>(() => {
  const completed = Number(modelValue)
  if (completed < 30)
    return '#B71C1C'
  if (completed < 60)
    return '#EF6C00'
  if (completed < 85)
    return '#FDD835'

  return '#4CAF50'
})
</script>
<template>
  <v-progress-circular
      :size="100"
      :width="15"
      :model-value="modelValue"
      :color="color"
      class="v-theme--light"
  >
    {{ modelValue }}%
  </v-progress-circular>
</template>