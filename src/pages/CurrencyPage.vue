<template>
  <q-page padding>
    <create-currency-component class="q-mb-sm" />

    <h2>Total funds {{ totalFunds }}</h2>

    <q-table title="Currencies" :columns="columns" :rows="rows">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="label" :props="props">
            {{ props.row.label }}
          </q-td>
          <q-td key="value" :props="props">
            {{ props.row.value }}
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
              class="q-ma-xs"
              color="blue"
              icon="remove"
              label="Remove"
              dense
              @click="removeCurrencyAmount(props.row.id)"
              :disable="props.row.amount < 1"
            />
            <q-btn
              class="q-ma-xs text-black"
              color="yellow"
              icon="edit"
              label="Edit"
              dense
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
    <q-dialog persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Edit currency</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section> </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { Notify, QTableColumn } from 'quasar';
import { Ref, onMounted, ref } from 'vue';

import CreateCurrencyComponent from 'src/components/CreateCurrencyComponent.vue';
import { useCollectionsStore } from 'src/stores/collections-store';
import { CurrencyDocument } from 'src/database';

const collectionStore = useCollectionsStore();

const totalFunds: Ref<number> = ref(0);

const columns: QTableColumn[] = [
  {
    name: 'label',
    required: true,
    label: 'Label',
    align: 'left',
    field: 'label',
    sortable: true,
  },
  {
    name: 'value',
    required: true,
    label: 'Value',
    align: 'left',
    field: 'value',
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

const rows: Ref<CurrencyDocument[] | undefined> = ref([]);

const fetchCurrencies = async () => {
  rows.value = await collectionStore.collections?.currencies
    .find()
    .sort('value')
    .exec();
  let sum = 0;
  for (const row of rows.value as CurrencyDocument[]) {
    sum += row.value * row.amount;
  }

  totalFunds.value = sum;
};

const deleteCurrency = async (currencyId: string) => {
  const currency = await collectionStore.collections?.currencies
    .findOne({ selector: { id: currencyId } })
    .exec();

  const result = await currency?.remove();
  console.log(result);
  if (result?._deleted === true) {
    Notify.create({
      message: 'Currency deleted!',
      color: 'green',
    });
  }
};

const addCurrencyAmount = async (currencyId: string) => {
  const document = await collectionStore.collections?.currencies
    .findOne({ selector: { id: currencyId } })
    .exec();

  await document?.incrementalModify((oldProduct) => {
    oldProduct.amount = oldProduct.amount + 1;
    return oldProduct;
  });
};

const removeCurrencyAmount = async (currencyId: string) => {
  const document = await collectionStore.collections?.currencies
    .findOne({ selector: { id: currencyId } })
    .exec();

  await document?.incrementalModify((oldProduct) => {
    oldProduct.amount = oldProduct.amount - 1;
    return oldProduct;
  });
};

collectionStore.collections?.currencies.$.subscribe(() => {
  fetchCurrencies();
});

onMounted(() => {
  fetchCurrencies();
});
</script>
