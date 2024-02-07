<template>
  <q-page padding>
    <create-currency-component class="q-mb-sm" />

    <q-table title="Currencies" :columns="columns" :rows="rows">
      <template v-slot:top>
        <div class="q-table__title">Currencies</div>
        <q-space />
        <p class="text-subtitle2">Total funds: {{ totalFunds }}</p>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="type" :props="props">
            {{ props.row.type }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ props.row.amount }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              class="q-ma-xs"
              color="green"
              icon="add"
              label="Add"
              dense
              @click="addCurrencyAmount(props.row.id)"
            />
            <q-btn
              color="blue"
              icon="remove"
              label="Remove"
              dense
              @click="removeCurrencyAmount(props.row.id)"
              :disable="props.row.amount < 1"
            />
            <q-btn
              class="q-ma-xs"
              color="red"
              icon="delete"
              label="Delete"
              dense
              @click="deleteCurrency(props.row.id)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { Notify, QTableColumn } from 'quasar';
import { Ref, onMounted, ref } from 'vue';

import CreateCurrencyComponent from 'src/components/CreateCurrencyComponent.vue';
import { useCollectionsStore } from 'src/stores/collections-store';

const collectionStore = useCollectionsStore();

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
    sortable: false,
  },
];

const rows: Ref<object[]> = ref();

const fetchCurrencies = async () => {
  rows.value = await collectionStore.collections.currencies
    .find({ selector: {} })
    .exec();

  rows.value.sort((a: object, b: object) => {
    if (a.type > b.type) {
      return -1;
    }
    return 1;
  });

  let sum = 0;
  for (const row of rows.value) {
    sum += row.type * row.amount;
  }

  totalFunds.value = sum;
};

const deleteCurrency = async (currencyId: object) => {
  const currency = await collectionStore.collections.currencies
    .findOne({ selector: { id: currencyId } })
    .exec();

  const result = await currency.remove();
  console.log(result);
  if (result._deleted === true) {
    Notify.create({
      message: 'Currency deleted!',
      color: 'green',
    });
  }
};

const addCurrencyAmount = async (currencyId) => {
  const document = await collectionStore.collections.currencies
    .findOne({ selector: { id: currencyId } })
    .exec();

  await document.incrementalModify((oldProduct: object) => {
    oldProduct.amount = oldProduct.amount + 1;
    return oldProduct;
  });
};

const removeCurrencyAmount = async (currencyId) => {
  const document = await collectionStore.collections.currencies
    .findOne({ selector: { id: currencyId } })
    .exec();

  await document.incrementalModify((oldProduct: object) => {
    oldProduct.amount = oldProduct.amount - 1;
    return oldProduct;
  });
};

collectionStore.collections.currencies.$.subscribe(() => {
  fetchCurrencies();
});

onMounted(() => {
  fetchCurrencies();
});
</script>
