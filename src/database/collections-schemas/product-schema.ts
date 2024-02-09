import {
  RxJsonSchema,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
} from 'rxdb';

export const productSchemaLiteral = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    name: {
      type: 'string',
    },
    quantity: {
      type: 'number',
    },
    price: {
      type: 'number',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id', 'name', 'quantity', 'price', 'timestamp'],
} as const;

const schemaTyped = toTypedRxJsonSchema(productSchemaLiteral);

export type ProductDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const productSchema: RxJsonSchema<ProductDocType> = productSchemaLiteral;
