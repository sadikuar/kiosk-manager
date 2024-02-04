<template>
  <q-card>
    <q-card-section>
      <h5 class="q-mt-sm">Create product</h5>
      <q-form @reset="onReset" @submit="onSubmit">
        <div class="q-gutter-y-md">
          <q-input
            v-model="productName"
            label="Product name"
            type="text"
          ></q-input>
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
          <div>
            <q-btn label="submit" type="submit" color="primary" />
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
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { useCollectionsStore } from 'src/stores/collections-store';
import { Ref, ref } from 'vue';

const collectionStore = useCollectionsStore();

const productName: Ref<string> = ref('');
const quantity: Ref<number> = ref(0);
const price: Ref<number> = ref(0.0);

const onReset = () => {
  productName.value = '';
  quantity.value = 0;
  price.value = 0.0;
};

const onSubmit = async () => {
  const newProduct = await collectionStore.collections.products.insert({
    id: crypto.randomUUID(),
    name: productName.value,
    quantity: quantity.value,
    price: price.value,
  });

  if (newProduct !== null) {
    Notify.create({
      message: 'Product added!',
      color: 'green',
    });
  }
};
</script>
