<template>
  <div class="row q-gutter-sm q-mb-sm">
    <q-btn
      v-for="currency in currencies"
      :key="currency.id"
      :label="currency.label"
      :push="true"
      style="width: 6rem"
      :color="buttonsColor"
      :disable="
        isReferenceValueZeroOrUndefined ||
        isReturningCurrencyAndHasNoAmount(currency.amount) ||
        isReturningCurrencyAndReferenceValueIsLqThanValue(currency.value) ||
        isReturningChangeAndReturnChangeMinusCurrencyValueLesserThanZero(
          currency.value
        )
      "
      @click="onClick(currency)"
    />
  </div>
</template>

<script setup lang="ts">
import { CurrencyDocument } from 'src/database';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  returningCurrency?: boolean;
  referenceValue?: number;
  buttonsColor?: string;
}>();

const emits = defineEmits<{
  (e: 'currencyClicked', type: number): void;
  (e: 'histogramUpdated', id: string, label: string, amount: number): void;
}>();

const collectionStore = useCollectionsStore();

const currencies: Ref<CurrencyDocument[] | undefined> = ref([]);
const returnChange: Ref<number> = ref(0);

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
    return props.returningCurrency && props.referenceValue < value;
  }
  return true;
};

const isReturningChangeAndReturnChangeMinusCurrencyValueLesserThanZero = (
  value: number
): boolean => {
  return props.returningCurrency && returnChange.value - value < 0;
};

const fetchCurrenies = async () => {
  currencies.value = await collectionStore.collections?.currencies
    .find()
    .sort('value')
    .exec();
};

const onClick = (currency: CurrencyDocument) => {
  if (
    props.returningCurrency &&
    props.referenceValue !== undefined &&
    returnChange.value - currency.value >= 0
  ) {
    returnChange.value -= currency.value;
  }
  const value = props.returningCurrency ? -1 : 1;
  emits('histogramUpdated', currency.id, currency.label, value);
  emits('currencyClicked', currency.value);
};

watch(
  () => props.referenceValue,
  (newValue, _) => {
    returnChange.value = newValue || 0;
  }
);

onMounted(() => {
  fetchCurrenies();
});
</script>
