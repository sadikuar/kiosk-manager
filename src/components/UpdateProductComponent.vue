<template>
  <q-form @reset="onReset" @submit="onSubmit">
    <div class="q-gutter-y-md">
      <q-input v-model="productName" label="Product name" type="text"></q-input>
      <div class="row q-gutter-x-md justify-between">
        <q-input
          v-model.number="quantity"
          label="Quantity"
          type="number"
          class="col-grow"
        ></q-input>
        <q-input
          v-model.number="price"
          label="Price (per unit)"
          type="number"
          class="col-grow"
        ></q-input>
      </div>
      <div class="row q-gutter-x-md justify-end">
        <q-btn label="submit" type="submit" color="primary" v-close-popup />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { ProductDocument } from 'src/database';
import { Ref, ref, watch } from 'vue';

const props = defineProps<{
  product?: ProductDocument;
}>();

const emits = defineEmits<{
  (e: 'updatedProduct'): void;
}>();

const productName: Ref<string> = ref('');
const quantity: Ref<number> = ref(0);
const price: Ref<number> = ref(0.0);

const onReset = () => {
  productName.value = props.product?.name || '';
  quantity.value = props.product?.quantity || 0;
  price.value = props.product?.price || 0;
};

const onSubmit = async () => {
  const currentTimestamp = new Date().toISOString();
  const result = await props.product?.incrementalPatch({
    name: productName.value,
    quantity: quantity.value,
    price: price.value,
    timestamp: currentTimestamp,
  });

  if (result?.timestamp === currentTimestamp) {
    Notify.create({
      message: 'Product updated!',
      color: 'green',
    });

    emits('updatedProduct');
  }
};

watch(
  () => props.product,
  (newProduct: ProductDocument | undefined) => {
    productName.value = newProduct?.name || '';
    quantity.value = newProduct?.quantity || 0;
    price.value = newProduct?.price || 0;
  }
);
</script>
