import {
  CurrencyCollection,
  ProductCollection,
  TransactionCollection,
} from '.';

export type Collection = {
  products: ProductCollection;
  transactions: TransactionCollection;
  currencies: CurrencyCollection;
};

export type Product = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  timestamp: string;
};
