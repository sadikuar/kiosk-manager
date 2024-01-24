export const transactionSchema = {
  version: 1,
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
    timestamp: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id', 'name', 'quantity', 'timestamp'],
};
