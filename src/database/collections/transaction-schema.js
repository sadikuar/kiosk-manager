export const transactionSchema = {
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
      type: 'int',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id', 'name', 'quantity', 'timestamp'],
};
