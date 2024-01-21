<template>
  <q-page padding>
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
import { Ref, ref } from 'vue';

const columns = [
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
    align: 'left',
  },
];

const rows: Ref<never[]> = ref([]);

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
