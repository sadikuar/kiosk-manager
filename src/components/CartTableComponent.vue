<template>
  <q-table
    title="Cart"
    :columns="cartColumns"
    :rows="componentProps.products"
    class="q-mb-md"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="name" class="ellipsis">
          {{ props.row.name }}
        </q-td>
        <q-td key="sellingPrice">
          {{ props.row.price }}
        </q-td>
        <q-td key="action">
          <q-btn
            class="q-ma-xs"
            color="red"
            icon="remove"
            label="Remove"
            dense
            @click="$emit('removeProductFromCart', props.row)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <div class="row q-gutter-sm items-center">
    <q-btn
      color="red"
      icon="delete_forever"
      label="Clear cart"
      class="q-my-none"
      dense
      @click="$emit('clearCart')"
    />
    <q-btn
      color="green"
      icon="attach_money"
      label="Start transaction"
      class="q-my-none q-mr-auto"
      :disable="componentProps.products.length === 0"
      dense
      @click="finishingTransaction = true"
    />

    <q-dialog v-model="finishingTransaction" persistent>
      <q-card style="width: 60rem; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Finishing transaction</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <div class="col">
              <currency-numerical-pad-component-vue
                :total-cost="totalCost"
                @currency-clicked="updateAmountGiven"
              />
            </div>
            <div class="col">
              <h5 class="q-my-none">Total cost: {{ totalCost }}</h5>
              <div class="row">
                <div class="col">
                  <p class="text-h6">
                    Amount given: {{ amountGiven.toFixed(1) }}
                  </p>
                </div>
                <div class="col">
                  <q-btn label="Clear" color="red" @click="amountGiven = 0" />
                </div>
              </div>
              <p class="text-h6">Return change: {{ returnChange }}</p>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Finish transaction" color="green" />
          <q-btn label="Cancel" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { Notify, useQuasar } from 'quasar';
import { QTableColumn } from 'quasar/dist/types/api/qtable';
import { ProductDocument } from 'src/database';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, computed, onMounted, ref, toRef } from 'vue';
import CurrencyNumericalPadComponentVue from './CurrencyNumericalPadComponent.vue';

const componentProps = defineProps<{
  products: Array<ProductDocument>;
}>();

const emit = defineEmits<{
  (e: 'updateProducts'): void;
  (e: 'finishTransaction'): void;
  (e: 'removeProductFromCart', product: ProductDocument): void;
  (e: 'clearCart'): void;
}>();

const cartProducts: Ref = toRef(componentProps.products);
const finishingTransaction: Ref<boolean> = ref(false);
const amountGiven: Ref<number> = ref(0);

const totalCost = computed(() => {
  let initialValue = 0;
  return componentProps.products
    .map((element: ProductDocument) => element.price)
    .reduce(
      (accumulator: number, currentValue: number) => accumulator + currentValue,
      initialValue
    );
});

const returnChange = computed(() => {
  if (amountGiven.value > 0 && amountGiven.value > totalCost.value) {
    return (amountGiven.value - totalCost.value).toFixed(1);
  }
  return 0;
});

const collectionStore = useCollectionsStore();
const $q = useQuasar();

const cartColumns: QTableColumn[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'sellingPrice',
    required: true,
    label: 'Selling price',
    align: 'left',
    field: 'sellingPrice',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    field: '',
    align: 'left',
  },
];

const finishTransaction = async () => {
  finishingTransaction.value = true;
  const newTransaction = await collectionStore.collections?.transactions.insert(
    {
      id: crypto.randomUUID(),
      products: componentProps.products.map((element: any) => element.id),
      amount: componentProps.products
        .map((element: any) => element.price)
        .reduce(
          (accumulator: number, currentValue: number) =>
            accumulator + currentValue,
          0
        ),
      timestamp: new Date().toISOString(),
    }
  );
  if (newTransaction !== null) {
    Notify.create({
      message: 'Transaction added!',
      color: 'green',
    });
    emit('finishTransaction');
  }
};

const updateAmountGiven = (type: number) => {
  amountGiven.value += type;
};

onMounted(() => {
  if ($q.localStorage.has('cart')) {
    cartProducts.value = $q.localStorage.getItem('cart') || [];
  }
});
</script>
