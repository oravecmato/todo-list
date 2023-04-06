<script setup lang="ts">

import {computed, ref} from "vue";

const {modelValue} = defineProps<{
  modelValue: number|string
}>()

const percent = ref<number>(Math.floor(Number(modelValue) * 100))

const color = computed<string>(() => {
  if (percent.value < 30)
    return '#B71C1C'
  if (percent.value < 60)
    return '#EF6C00'
  if (percent.value < 85)
    return '#FDD835'

  return '#4CAF50'
})
</script>
<template>
  <v-progress-circular
      :size="100"
      :width="15"
      :model-value="percent"
      :color="color"
      class="v-theme--light"
  >
    {{ percent }}%
  </v-progress-circular>
</template>