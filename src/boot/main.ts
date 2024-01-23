import { boot } from 'quasar/wrappers';
import initialiseRxDB from 'src/database';
import { useDbStore } from 'src/stores/db-store';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  const db = useDbStore();
  db.db = initialiseRxDB();

  // FIXME: not working
  // console.log(db.get('test'));
});
