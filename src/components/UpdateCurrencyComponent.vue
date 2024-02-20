<template>
  <q-form @reset="onReset" @submit="onSubmit">
    <div class="q-gutter-y-md">
      <div class="row q-gutter-x-md justify-between">
        <q-input v-model="label" label="Label" class="col-grow"></q-input>
        <q-input
          v-model.number="value"
          label="Value"
          type="number"
          class="col-grow"
          step="0.1"
          decimals
        ></q-input>
        <q-input
          v-model.number="amount"
          label="Amount"
          type="number"
          class="col-grow"
        ></q-input>
      </div>
      <div>
        <q-btn label="submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { CurrencyDocument } from 'src/database';
import { Ref, ref, watch } from 'vue';

const props = defineProps<{
  currency?: CurrencyDocument;
}>();

const emits = defineEmits<{
  (e: 'updatedCurrency'): void;
}>();

const label: Ref<string> = ref('');
const value: Ref<number> = ref(0.0);
const amount: Ref<number> = ref(0);

const onReset = () => {
  label.value = props.currency?.label || '';
  value.value = props.currency?.value || 0.0;
  amount.value = props.currency?.amount || 0;
};

const onSubmit = async () => {
  const currentTimestamp = new Date().toISOString();
  const result = await props.currency?.incrementalPatch({
    label: label.value,
    value: value.value,
    amount: amount.value,
    timestamp: currentTimestamp,
  });

  if (result?.timestamp === currentTimestamp) {
    Notify.create({
      message: 'Currency updated!',
      color: 'green',
    });

    emits('updatedCurrency');
  }
};

watch(
  () => props.currency,
  (newCurrency: CurrencyDocument | undefined) => {
    label.value = newCurrency?.label || '';
    value.value = newCurrency?.value || 0.0;
    amount.value = newCurrency?.amount || 0;
  }
);
</script>
