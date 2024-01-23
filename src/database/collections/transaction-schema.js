export const transactionSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
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
