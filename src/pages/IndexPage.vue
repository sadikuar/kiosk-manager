<template>
  <q-page padding>
    <div class="row justify-between items-stretch q-mb-md">
      <div class="col-6 col-grow q-pr-sm">
        <product-table-component :products="stockpileProducts">
          <template v-slot:table-action="props">
            <q-btn
              class="q-ma-xs"
              color="green"
              icon="add"
              label="Add"
              dense
              :disable="props.data.row.quantity === 0"
              @click="addProductToCart(props.data.row)"
            />
          </template>
        </product-table-component>
      </div>
      <div class="col-6 col-grow q-pl-sm">
        <cart-table-component
          @update-products="fetchProducts"
          @cash-out="cashOut"
          @remove-product-from-cart="removeProductFromCart"
          @clear-cart="clearCart"
          :products="cartProducts"
        />
      </div>
    </div>
    <q-table
      title="Transaction history"
      :columns="transactionColumns"
      :rows="transactions"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="timestamp" :props="props"> {{ props.row.timestamp }}</q-td>
          <q-td key="numberOfProducts" :props="props">
            {{ props.row.products.length }}</q-td
          >
          <q-td key="amount" :props="props"> {{ props.row.amount }}</q-td>
          <q-td key="action">
            <q-btn
              class="q-ma-xs"
              color="red"
              icon="delete"
              label="Remove"
              dense
              @click="removeTransaction(props.row.id)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { Notify, QTableColumn, useQuasar } from 'quasar';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, onMounted, ref } from 'vue';
import ProductTableComponent from 'src/components/ProductTableComponent.vue';
import CartTableComponent from 'src/components/CartTableComponent.vue';
import { ProductDocument } from 'src/database';

const collectionStore = useCollectionsStore();

collectionStore.collections?.transactions.remove$.subscribe(() =>
  fetchTransactions()
);

const stockpileProducts: Ref<ProductDocument[] | undefined> = ref([]);
const cartProducts: Ref<ProductDocument[]> = ref([]);
const transactions: Ref<object[]> = ref([]);

const $q = useQuasar();

const transactionColumns: QTableColumn[] = [
  {
    name: 'timestamp',
    required: true,
    label: 'Timestamp',
    align: 'left',
    field: 'timestamp',
    sortable: true,
  },
  {
    name: 'numberOfProducts',
    required: true,
    label: 'Number of products',
    align: 'left',
    field: 'numberOfProducts',
    sortable: true,
  },
  {
    name: 'amount',
    required: true,
    label: 'Amount',
    align: 'left',
    field: 'amount',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    field: '',
    align: 'left',
  },
];

const fetchProducts = async () => {
  stockpileProducts.value = await collectionStore.collections?.products
    .find({ selector: {} })
    .exec();
};

const fetchTransactions = async () => {
  transactions.value =
    (await collectionStore.collections?.transactions
      .find({ selector: {} })
      .exec()) || [];
};

const addProductToCart = async (product: ProductDocument) => {
  if (product.quantity != 0) {
    await product.modify((oldProduct: any) => {
      oldProduct.quantity = oldProduct.quantity - 1;
      return oldProduct;
    });

    cartProducts.value.push(product);

    fetchProducts();
  }

  try {
    $q.localStorage.set('cart', cartProducts.value);
  } catch (error) {
    Notify.create({
      message: "Couldn't store cart in local Storage: " + error,
      color: 'red',
    });
  }
};

const removeTransaction = async (transactionId: string) => {
  const transaction = await collectionStore.collections?.transactions
    .findOne({
      selector: { id: transactionId },
    })
    .exec();
  const result = transaction?.remove();
  if (result !== null) {
    Notify.create({
      message: 'Transaction deleted!',
      color: 'green',
    });
  }
};

const removeProductFromCart = async (product: ProductDocument) => {
  const document = await collectionStore.collections?.products
    .findOne({ selector: { id: product.id } })
    .exec();

  await document?.modify((oldProduct: any) => {
    oldProduct.quantity = oldProduct.quantity + 1;
    return oldProduct;
  });

  cartProducts.value.splice(
    cartProducts.value.findIndex((element: any) => element.id === product.id),
    1
  );

  $q.localStorage.set('cart', cartProducts.value);

  await fetchProducts();
};

const clearCart = async () => {
  $q.localStorage.remove('cart');

  for (const product of cartProducts.value as ProductDocument[]) {
    const document = await collectionStore.collections?.products
      .findOne({ selector: { id: product.id } })
      .exec();

    await document?.incrementalModify((oldProduct: any) => {
      oldProduct.quantity = oldProduct.quantity + 1;
      return oldProduct;
    });
  }

  cartProducts.value = Array<ProductDocument>();

  await fetchProducts();
};

const cashOut = () => {
  $q.localStorage.remove('cart');
  cartProducts.value = Array<ProductDocument>();
};

onMounted(() => {
  fetchProducts();
  fetchTransactions();

  if ($q.localStorage.has('cart')) {
    cartProducts.value = $q.localStorage.getItem('cart') || [];
  }
});
</script>
