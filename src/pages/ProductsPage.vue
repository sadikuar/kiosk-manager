<template>
  <q-page padding>
    <q-card class="q-mb-sm">
      <q-card-section>
        <h5 class="q-mt-sm">Create product</h5>
        <create-product-component
          class="q-mb-sm"
          @added-product="fetchProducts"
        />
      </q-card-section>
    </q-card>

    <product-table-component :products="rows">
      <template v-slot:table-action="props">
        <q-btn
          class="q-ma-xs text-black"
          color="yellow"
          icon="edit"
          label="Edit"
          dense
          @click="updateProduct(props.data.row)"
        />
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

    <q-dialog persistent>
      <q-card v-model="updateDialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Edit product</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <update-product-component :product="product" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, ref, onMounted } from 'vue';
import { ProductDocument } from 'src/database';
import CreateProductComponent from 'src/components/CreateProductComponent.vue';
import ProductTableComponent from 'src/components/ProductTableComponent.vue';
import UpdateProductComponent from 'src/components/UpdateProductComponent.vue';

const collectionStore = useCollectionsStore();

collectionStore.collections?.products.remove$.subscribe(() => fetchProducts());

const rows: Ref<ProductDocument[] | undefined> = ref([]);
const product: Ref<ProductDocument | undefined> = ref(undefined);
const updateDialog: Ref<boolean> = ref(false);

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

const updateProduct = async (rowValue: any) => {
  updateDialog.value = true;
  product.value =
    (await collectionStore.collections?.products
      .findOne({
        selector: { id: rowValue.id },
      })
      .exec()) || undefined;
};

onMounted(() => {
  fetchProducts();
});
</script>
