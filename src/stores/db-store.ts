import { defineStore } from 'pinia';

export const useDbStore = defineStore('db', {
  state: () => ({
    db: null,
  }),
});
