<template>
  <div class="row q-gutter-sm q-mb-sm">
    <q-btn
      v-for="currency in currencies"
      :key="currency.id"
      :label="currency.type"
      size="xl"
      :push="true"
      style="width: 5rem"
      color="blue-10"
      :disable="isTotalCostZeroOrUndefined"
      @click="updateGainedCurrency(currency.type)"
    />
  </div>
</template>

<script setup lang="ts">
import { CurrencyDocument } from 'src/database';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, computed, onMounted, ref } from 'vue';

type CurrencyAmountObject = {
  [currency: string]: { amount: number };
};

const props = defineProps<{
  totalCost?: number;
}>();

const emits = defineEmits<{
  (e: 'currencyClicked', type: number): void;
}>();

const collectionStore = useCollectionsStore();

const currencies: Ref<CurrencyDocument[] | undefined> = ref([]);
const gainedCurrencies: Ref<CurrencyAmountObject> = ref({});

const isTotalCostZeroOrUndefined = computed(() => {
  if (props.totalCost !== undefined) {
    return props.totalCost < 0;
  }
  return false;
});

const fetchCurrenies = async () => {
  currencies.value = await collectionStore.collections?.currencies
    .find()
    .sort('type')
    .exec();
};

const updateGainedCurrency = (currency: number) => {
  if (currency in gainedCurrencies.value) {
    gainedCurrencies.value[currency].amount += 1;
  } else {
    gainedCurrencies.value[currency] = { amount: 1 };
  }
  emits('currencyClicked', currency);
};

onMounted(() => {
  fetchCurrenies();
});
</script>
