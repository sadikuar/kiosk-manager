import { createRxDatabase, removeRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';

import { productSchema } from './collections/product-schema';
import { transactionSchema } from './collections/transaction-schema';

export default async function initialiseRxDB() {
  if (process.env.DEV) {
    addRxPlugin(RxDBDevModePlugin);
  }

  addRxPlugin(RxDBMigrationPlugin);

  const kioskDb = await createRxDatabase({
    name: 'kiosk-db' + new Date().getTime(),
    storage: getRxStorageDexie(),
  });

  return await kioskDb.addCollections({
    products: {
      schema: productSchema,
      autoMigrate: true,
    },
    transactions: {
      schema: transactionSchema,
      autoMigrate: true,
      migrationStrategies: {
        // 1 means, this transforms data from version 0 to version 1
        1: function (oldDoc) {
          oldDoc.time = new Date(oldDoc.time).getTime(); // string to unix
          return oldDoc;
        },
      },
    },
  });
}
