<script setup lang="ts">

import {onUnmounted, ref, watch} from "vue";

const {open, question} = defineProps<{
  open: boolean
  question: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', dialogState: boolean): void
  (e: '@confirm'): void
}>()

let dialogState = ref<boolean>(open)

const unwatch = watch(dialogState, () => {
  emit('update:modelValue', dialogState.value)
})

const handleConfirm = (): void => {
  emit('@confirm')
  dialogState.value = false
}

onUnmounted(() => unwatch())

</script>
<template>
    <v-dialog
        v-model="dialogState"
        width="auto"
    >
      <v-card class="pa-3">
        <v-card-text>
          {{ question }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              variant="tonal"
              @click="dialogState = false"
          >
            No
          </v-btn>
          <v-btn
              color="red-darken-1"
              variant="tonal"
              @click="handleConfirm"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>