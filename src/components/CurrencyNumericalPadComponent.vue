<template>
  <section>
    <div class="row q-gutter-sm q-mb-sm">
      <q-btn
        v-for="currency in currencies"
        :key="currency.id"
        :label="currency.type"
        size="xl"
        :push="true"
        style="width: 5rem"
        :disable="totalCost! < 0 || totalCost === undefined"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { CurrencyDocument } from 'src/database';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, onMounted, ref } from 'vue';

defineProps<{
  totalCost?: number;
}>();

const collectionStore = useCollectionsStore();

const currencies: Ref<CurrencyDocument[] | undefined> = ref([]);

const fetchCurrenies = async () => {
  currencies.value = await collectionStore.collections?.currencies
    .find()
    .sort('type')
    .exec();
};

onMounted(() => {
  fetchCurrenies();
});
</script>
