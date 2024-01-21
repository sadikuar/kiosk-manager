import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

import { productSchema } from './collections/product-schema';

export default async function initialiseRxDB() {
  if (process.env.DEV) {
    addRxPlugin(RxDBDevModePlugin);
  }

  const kioskDb = await createRxDatabase({
    name: 'kiosk-db',
    storage: getRxStorageDexie(),
  });

  await kioskDb.addCollections({
    products: {
      schema: productSchema,
    },
  });
}
