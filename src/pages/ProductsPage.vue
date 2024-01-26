<template>
  <q-page padding>
    <q-btn
      class="q-mb-md"
      color="secondary"
      label="Add product"
      icon="add"
      to="create-product"
    ></q-btn>

    <q-table title="Products" :columns="columns" :rows="rows">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
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
              icon="delete"
              label="Delete"
              dense
              @click="deleteProduct(props.row.id)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { Notify, QTableColumn } from 'quasar';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, ref, onMounted } from 'vue';

const collectionStore = useCollectionsStore();

collectionStore.collections.products.remove$.subscribe(() => fetchProducts());

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

const rows: Ref<object[]> = ref([]);

const fetchProducts = async () => {
  const products = await collectionStore.collections.products
    .find({ selector: {} })
    .exec();

  rows.value = products;
};

const deleteProduct = async (productId: string) => {
  const product = await collectionStore.collections.products
    .findOne({ selector: { id: productId } })
    .exec();
  const result = product.remove();
  if (result !== null) {
    Notify.create({ message: 'Product deleted!', color: 'green' });
  }
};

onMounted(() => {
  fetchProducts();
});
</script>
