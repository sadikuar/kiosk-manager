<template>
  <q-table :columns="productColumns" :rows="products" :filter="filter">
    <template v-slot:top>
      <div class="q-table__title">Products</div>
      <q-space />
      <q-input dense debounce="300" color="primary" v-model="filter">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="name" class="ellipsis">
          {{ props.row.name }}
        </q-td>
        <q-td key="quantity">
          {{ props.row.quantity }}
        </q-td>
        <q-td key="sellingPrice">
          {{ props.row.price }}
        </q-td>
        <q-td key="action">
          <slot name="table-action" :data="props"> </slot>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { QTableColumn } from 'quasar/dist/types/api/qtable';

defineProps({
  products: Array<object>,
});

const filter: Ref<string> = ref('');

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
</script>
