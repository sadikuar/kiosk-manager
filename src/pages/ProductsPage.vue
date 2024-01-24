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
          <q-td key="action">
            <q-btn class="q-ma-xs" color="blue" icon="add" label="Sell" dense />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar';
import { Ref, ref } from 'vue';

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
    name: 'actions',
    label: 'Actions',
    field: '',
    align: 'left',
  },
];

const rows: Ref<object[]> = ref([]);

rows.value = [
  {
    name: 'Snickers',
    quantity: 10,
  },
  {
    name: 'Snickers',
    quantity: 10,
  },
];
</script>
