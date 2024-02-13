import {
  createRxDatabase,
  removeRxDatabase,
  addRxPlugin,
  RxDocument,
  RxCollection,
} from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';

import {
  ProductDocType,
  productSchema,
} from './collections-schemas/product-schema';
import {
  TransactionDocType,
  transactionSchema,
} from './collections-schemas/transaction-schema';
import {
  CurrencyDocType,
  currencySchema,
} from './collections-schemas/currency-schema';

export type ProductDocument = RxDocument<ProductDocType>;
export type CurrencyDocument = RxDocument<CurrencyDocType>;
export type TransactionDocument = RxDocument<TransactionDocType>;

export type ProductCollection = RxCollection<ProductDocType>;
export type CurrencyCollection = RxCollection<CurrencyDocType>;
export type TransactionCollection = RxCollection<TransactionDocType>;

export type KioskDatabaseCollections = {
  products: ProductCollection;
  currencies: CurrencyCollection;
  transactions: TransactionCollection;
};

export default async function initialiseRxDB() {
  if (process.env.DEV) {
    addRxPlugin(RxDBDevModePlugin);
  }

  addRxPlugin(RxDBMigrationPlugin);
  addRxPlugin(RxDBQueryBuilderPlugin);

  removeRxDatabase('kiosk-db', getRxStorageDexie());

  const kioskDb = await createRxDatabase<KioskDatabaseCollections>({
    name: 'kiosk-db',
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
        2: function (oldDoc) {
          oldDoc.time = new Date(oldDoc.time).getTime(); // string to unix
          return oldDoc;
        },
      },
    },
    currencies: {
      schema: currencySchema,
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
