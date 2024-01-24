import { defineStore } from 'pinia';

export const useCollectionsStore = defineStore('db', {
  state: () => ({
    collections: Object(),
  }),
});
