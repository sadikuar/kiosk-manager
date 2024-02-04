<template>
  <q-page padding>
    <create-currency-component class="q-mb-sm" />

    <q-table title="Currencies" :columns="columns">
      <template v-slot:top>
        <div class="q-table__title">Currencies</div>
        <q-space />
        <p class="text-subtitle2">Total funds {{ totalFunds }}</p>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar';
import { Ref, ref } from 'vue';

import CreateCurrencyComponent from 'src/components/CreateCurrencyComponent.vue';

const totalFunds: Ref<number> = ref(0);

const columns: QTableColumn[] = [
  {
    name: 'type',
    required: true,
    label: 'Type',
    align: 'left',
    field: 'type',
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
    name: 'action',
    required: true,
    label: 'Action',
    align: 'left',
    field: 'action',
    sortable: true,
  },
];
</script>
