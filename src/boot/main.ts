import { boot } from 'quasar/wrappers';
import initialiseRxDB from 'src/database';
import { useCollectionsStore } from 'src/stores/collections-store';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  const db = useCollectionsStore();
  db.collections = await initialiseRxDB();
});
