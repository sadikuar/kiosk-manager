<template>
  <q-card>
    <q-card-section>
      <h5 class="q-mt-sm">Create currency</h5>
      <q-form @reset="onReset" @submit="onSubmit">
        <div class="q-gutter-y-md">
          <div class="row q-gutter-x-md justify-between">
            <q-input
              v-model.number="type"
              label="Type"
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
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, ref } from 'vue';

const collectionStore = useCollectionsStore();

const type: Ref<number> = ref(0);
const amount: Ref<number> = ref(0);

const onSubmit = async () => {
  const newCurrency = collectionStore.collections?.currencies.insert({
    id: crypto.randomUUID(),
    type: type.value,
    amount: amount.value,
    timestamp: new Date().toISOString(),
  });

  if (newCurrency !== null) {
    Notify.create({
      message: 'Currency created!',
      color: 'green',
    });
  }
};

const onReset = () => {
  type.value = 0;
  amount.value = 0;
};
</script>
