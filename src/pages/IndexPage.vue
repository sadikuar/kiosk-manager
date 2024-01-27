<template>
  <q-page padding>
    <div class="row justify-between items-stretch q-mb-md">
      <div class="col-6 col-grow q-pr-sm">
        <q-table
          title="Stockpile products"
          :columns="productColumns"
          :rows="stockpileProducts"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props" class="ellipsis">
                {{ props.row.name }}
              </q-td>
              <q-td key="quantity" :props="props">
                {{ props.row.quantity }}
              </q-td>
              <q-td key="sellingPrice" :props="props">
                {{ props.row.price }}
              </q-td>
              <q-td key="action">
                <q-btn
                  class="q-ma-xs"
                  color="green"
                  icon="add"
                  label="Add"
                  dense
                  @click="addProductToCart(props.row)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div class="col-6 col-grow q-pl-sm">
        <q-table title="Cart" :columns="productColumns" :rows="cartProducts">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props" class="ellipsis">
                {{ props.row.name }}
              </q-td>
              <q-td key="quantity" :props="props">
                {{ props.row.quantity }}
              </q-td>
              <q-td key="sellingPrice" :props="props">
                {{ props.row.price }}
              </q-td>
              <q-td key="action">
                <q-btn
                  class="q-ma-xs"
                  color="red"
                  icon="remove"
                  label="Remove"
                  dense
                  @click="removeFromCart(props.row)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="row q-mt-xs q-gutter-sm">
          <q-btn
            color="red"
            icon="delete_forever"
            label="Clear cart"
            dense
            @click="clearCart"
          />
          <q-btn
            color="green"
            icon="attach_money"
            label="Cash out"
            :disable="cartProducts.length === 0"
            dense
            @click="cashOut"
          />
        </div>
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

const collectionStore = useCollectionsStore();

collectionStore.collections.transactions.remove$.subscribe(() =>
  fetchTransactions()
);

const stockpileProducts: Ref<object[]> = ref([]);
const cartProducts: Ref<object[]> = ref([]);
const transactions: Ref<object[]> = ref([]);

const $q = useQuasar();

const productColumns: QTableColumn[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'quantity',
    required: true,
    label: 'Quantity',
    align: 'left',
    field: 'quantity',
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
  stockpileProducts.value = await collectionStore.collections.products
    .find({ selector: {} })
    .exec();
};

const fetchTransactions = async () => {
  transactions.value = await collectionStore.collections.transactions
    .find({ selector: {} })
    .exec();
};

const addProductToCart = (product: object) => {
  cartProducts.value.push(product);

  try {
    $q.localStorage.set('cart', cartProducts.value);
  } catch (error) {
    Notify.create({
      message: "Couldn't store cart in local Storage: " + error,
      color: 'red',
    });
  }
};

const removeFromCart = (product: object) => {
  cartProducts.value.splice(
    cartProducts.value.findIndex(
      (element: object) => element.id === product.id
    ),
    1
  );
  $q.localStorage.set('cart', cartProducts.value);
};

const clearCart = () => {
  $q.localStorage.remove('cart');
  cartProducts.value = Array<object>();
};

const cashOut = async () => {
  const newTransaction = await collectionStore.collections.transactions.insert({
    id: crypto.randomUUID(),
    products: cartProducts.value.map((element: object) => element.id),
    amount: cartProducts.value
      .map((element: object) => element.price)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
    timestamp: new Date().toISOString(),
  });

  if (newTransaction !== null) {
    Notify.create({
      message: 'Transaction added!',
      color: 'green',
    });

    clearCart();
    fetchTransactions();
  }
};

const removeTransaction = async (transactionId: string) => {
  const transaction = await collectionStore.collections.transactions
    .findOne({
      selector: { id: transactionId },
    })
    .exec();
  const result = transaction.remove();
  if (result !== null) {
    Notify.create({
      message: 'Transaction deleted!',
      color: 'green',
    });
  }
};

onMounted(() => {
  fetchProducts();
  fetchTransactions();

  if ($q.localStorage.has('cart')) {
    cartProducts.value = $q.localStorage.getItem('cart');
  }
});
</script>
