export const productSchema = {
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
      type: 'int',
    },
    price: {
      type: 'int',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id', 'name', 'quantity', 'timestamp'],
};
