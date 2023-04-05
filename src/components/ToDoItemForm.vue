<script setup lang="ts">
import {ToDoListDefinition} from "../typings/ToDoListDefinition";
import {computed, reactive} from "vue";
import {useVuelidate, ValidationRuleCollection} from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { useCustomVuelidateRules} from "../composables/useCustomVuelidateRules";

const {modelValue} = defineProps<{
  modelValue: ToDoListDefinition
}>()

const initialState:ToDoListDefinition = {
  name: ''
}

const emit = defineEmits<{
  (e: 'update:modelValue', formData: ToDoListDefinition): void
  (e: '@submit', formData: ToDoListDefinition): void
}>()

const formData: ToDoListDefinition = reactive({...initialState})
const handleSubmit = (): void => {
  emit('update:modelValue', formData)
  emit('@submit')
}

const {isDate, futureDate, realisticDate} = useCustomVuelidateRules()
const rules: Record<string, ValidationRuleCollection> = {
  name: {required}
}
const v$ = useVuelidate(rules, formData)
const isFormValid = computed<boolean>(() => !v$.value.$invalid)

</script>
<template>
  <form @submit.prevent="handleSubmit">
    <h2 class="mb-3">Create a ToDo List</h2>
    <div class="mb-3">
      <v-text-field
          v-model="formData.name"
          label="List name"
          :error-messages="v$.name.$errors.map(e => e.$message)"
          required
          @input="v$.name.$touch"
          @blur="v$.name.$touch"
      />
    </div>
    <div>
      <v-btn
          size="large"
          color="secondary"
          @click="handleSubmit"
          :disabled="!isFormValid"
      >
        Create
      </v-btn>
    </div>
  </form>
</template>