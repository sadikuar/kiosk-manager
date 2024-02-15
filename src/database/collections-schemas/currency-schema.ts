import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from 'rxdb';

export const currencySchemaLiteral = {
  version: 2,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    label: {
      type: 'string',
    },
    value: {
      type: 'number',
    },
    amount: {
      type: 'number',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id', 'label', 'value', 'amount', 'timestamp'],
} as const;

const schemaTyped = toTypedRxJsonSchema(currencySchemaLiteral);

export type CurrencyDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const currencySchema: RxJsonSchema<CurrencyDocType> =
  currencySchemaLiteral;
