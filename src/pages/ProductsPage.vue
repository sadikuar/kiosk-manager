<template>
  <q-page padding>
    <create-product-component class="q-mb-sm" @added-product="fetchProducts" />

    <product-table-component :products="rows">
      <template v-slot:table-action="props">
        <q-btn
          class="q-ma-xs"
          color="red"
          icon="delete"
          label="Delete"
          dense
          @click="deleteProduct(props.data.row.id)"
        />
      </template>
    </product-table-component>
  </q-page>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, ref, onMounted } from 'vue';
import CreateProductComponent from 'src/components/CreateProductComponent.vue';
import ProductTableComponent from 'src/components/ProductTableComponent.vue';
import { ProductDocument } from 'src/database';

const collectionStore = useCollectionsStore();

collectionStore.collections?.products.remove$.subscribe(() => fetchProducts());

const rows: Ref<ProductDocument[] | undefined> = ref([]);

const fetchProducts = async () => {
  const products = await collectionStore.collections?.products.find().exec();

  rows.value = products;
};

const deleteProduct = async (productId: string) => {
  const product = await collectionStore.collections?.products
    .findOne({ selector: { id: productId } })
    .exec();
  const result = await product?.remove();
  if (result?._deleted === true) {
    Notify.create({ message: 'Product deleted!', color: 'green' });
  }
};

onMounted(() => {
  fetchProducts();
});
</script>
