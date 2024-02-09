import { defineStore } from 'pinia';
import { Collection } from 'src/database/datatypes';
import { Ref, ref } from 'vue';

export const useCollectionsStore = defineStore('collections', () => {
  const collections: Ref<Collection | null> = ref(null);

  return { collections };
});
