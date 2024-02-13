<template>
  <section>
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
        :disable="cartProducts.length === 0"
        dense
        @click="cashOut"
      />
      <h5 class="q-my-none">Total {{ totalCost }}</h5>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Notify, useQuasar } from 'quasar';
import { QTableColumn } from 'quasar/dist/types/api/qtable';
import { ProductDocument } from 'src/database';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, onMounted, ref, toRef } from 'vue';

const componentProps = defineProps<{
  products: Array<ProductDocument>;
}>();

const emit = defineEmits<{
  (e: 'updateProducts'): void;
  (e: 'cashOut'): void;
  (e: 'removeProductFromCart', product: ProductDocument): void;
  (e: 'clearCart'): void;
}>();

const cartProducts: Ref = toRef(componentProps.products);
const totalCost: Ref<number> = ref(0);
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

const cashOut = async () => {
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

    emit('cashOut');
  }
};

onMounted(() => {
  if ($q.localStorage.has('cart')) {
    cartProducts.value = $q.localStorage.getItem('cart') || [];
  }
});
</script>
