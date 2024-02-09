import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
} from 'rxdb';

export const transactionSchemaLiteral = {
  version: 2,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    products: {
      type: 'array',
      ref: 'products',
      items: {
        type: 'string',
      },
    },
    amount: {
      type: 'number',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id', 'products', 'amount', 'timestamp'],
} as const;

const schemaTyped = toTypedRxJsonSchema(transactionSchemaLiteral);

export type TransactionDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const transactionSchema: RxJsonSchema<TransactionDocType> =
  transactionSchemaLiteral;
