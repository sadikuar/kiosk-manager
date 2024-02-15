<template>
  <div class="row q-gutter-sm q-mb-sm">
    <q-btn
      v-for="currency in currencies"
      :key="currency.id"
      :label="currency.label"
      :push="true"
      style="width: 6rem"
      color="blue-10"
      :disable="
        isReferenceValueZeroOrUndefined ||
        isReturningCurrencyAndHasNoAmount(currency.amount) ||
        isReturningCurrencyAndReferenceValueIsLqThanValue(currency.value)
      "
      @click="onClick(currency.id, currency.value)"
    />
  </div>
</template>

<script setup lang="ts">
import { CurrencyDocument } from 'src/database';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, computed, onMounted, ref } from 'vue';

const props = defineProps<{
  returningCurrency?: boolean;
  referenceValue?: number;
}>();

const emits = defineEmits<{
  (e: 'currencyClicked', type: number): void;
  (e: 'histogramUpdated', currencyId: string, amount: number): void;
}>();

const collectionStore = useCollectionsStore();

const currencies: Ref<CurrencyDocument[] | undefined> = ref([]);

const isReferenceValueZeroOrUndefined = computed(() => {
  if (props.referenceValue !== undefined) {
    return props.referenceValue <= 0;
  }
  return true;
});

const isReturningCurrencyAndHasNoAmount = (amount: number) =>
  props.returningCurrency && amount === 0;

const isReturningCurrencyAndReferenceValueIsLqThanValue = (value: number) => {
  if (props.referenceValue !== undefined) {
    return props.returningCurrency && props.referenceValue > value;
  }
};

const fetchCurrenies = async () => {
  currencies.value = await collectionStore.collections?.currencies
    .find()
    .sort('value')
    .exec();
};

const onClick = (currencyId: string, currencyType: number) => {
  const value = props.returningCurrency ? -1 : 1;
  emits('histogramUpdated', currencyId, value);
  emits('currencyClicked', currencyType);
};

onMounted(() => {
  fetchCurrenies();
});
</script>
