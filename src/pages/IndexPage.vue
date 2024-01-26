<template>
  <q-page padding>
    <div class="row justify-between items-stretch">
      <div class="col-6 col-grow q-pr-sm">
        <q-table
          title="Stockpile products"
          :columns="columns"
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
        <q-table title="Cart" :columns="columns" :rows="cartProducts">
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
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, onMounted, ref } from 'vue';

const collectionsStore = useCollectionsStore();

const stockpileProducts: Ref<object[]> = ref([]);
const cartProducts: Ref<object[]> = ref([]);

const columns: QTableColumn[] = [
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

const fetchProducts = async () => {
  stockpileProducts.value = await collectionsStore.collections.products
    .find({ selector: {} })
    .exec();
};

const addProductToCart = (product: object) => {
  cartProducts.value.push(product);
};

const removeFromCart = (product: object) => {
  cartProducts.value.splice(
    cartProducts.value.findIndex(
      (element: object) => element.id === product.id
    ),
    1
  );
};

onMounted(() => {
  fetchProducts();
});
</script>
