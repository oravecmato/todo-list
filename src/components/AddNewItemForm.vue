<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {ToDoItemDefinition} from "../typings/ToDoItemDefinition";
import {computed, reactive, ref, watch, watchEffect} from "vue";
import {useVuelidate, ValidationRuleCollection} from "@vuelidate/core";
import {useCustomVuelidateRules} from "../composables/useCustomVuelidateRules"
import {useMoment} from "../composables/useMoment";
import {required} from "@vuelidate/validators";
import {DATE_FORMAT} from "../constants";

const {getFormattedDate} = useMoment()
const initialState: ToDoItemDefinition = {
  title: '',
  text: '',
  deadline: ''
}
const deadlineRaw = ref<string|null>(null)

const formatDate = (date: Date): string => {
  // @ts-ignore
  if (isNaN(date) || date.getTime() <= 0)
    return ''

  return getFormattedDate(DATE_FORMAT, date.getTime())
}

const formData: ToDoItemDefinition = reactive({
  ...initialState
})

const emit = defineEmits<{
  (e: '@submit', formData: ToDoItemDefinition): void
}>()

const handleSubmit = (): void => {
  if (isFormValid.value)
    emit('@submit', formData);
}

const standardDateRules = useCustomVuelidateRules()
const rules: Record<string, ValidationRuleCollection> = {
  title: {required},
  text: {},
  deadline: {required, ...standardDateRules}
}
const v$ = useVuelidate(rules, formData)
const isFormValid = computed<boolean>(() => !v$.value.$invalid)

watch(deadlineRaw, (newValue) => {
  formData.deadline = formatDate(new Date(newValue || ''))
  v$.value.deadline.$touch()
})

</script>
<template>
  <form @submit.prevent="handleSubmit">
    <h2 class="mb-3">Add a ToDo</h2>
    <div class="mb-3">
      <v-text-field
          v-model="formData.title"
          label="Title"
          :error-messages="v$.title.$errors.map(e => e.$message)"
          required
          @input="v$.title.$touch"
          @blur="v$.title.$touch"
      />
    </div>
    <div class="mb-3">
      <v-textarea
          v-model="formData.text"
          label="Description"
      />
    </div>
    <div class="mb-3">
      <div>
          <VueDatePicker
              v-model="deadlineRaw"
              label="Deadline"
              placeholder="Deadline"
              :dark="true"
              :text-input="true"
              :format="formatDate"
              input-class-name="v-field__input"
          >
            <template #dp-input="{ value, onInput, onEnter, onTab, onClear }">
              <v-text-field
                  v-model="formData.deadline"
                  label="Deadline"
                  readonly
                  :error-messages="v$.deadline.$errors.map(e => e.$message || 'Please select a realistic date in the future')"
                  required
                  @blur="v$.deadline.$touch"
                  @change="v$.deadline.$touch"
              />
            </template>


          </VueDatePicker>

      </div>

    </div>
    <div>
      <v-btn
          size="large"
          color="secondary"
          type="submit"
          :disabled="!isFormValid"
      >
        Create
      </v-btn>
    </div>
  </form>
</template>