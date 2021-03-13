export default {
  $id: 'dio',
  type: 'object',
  additionalProperties: false,
  properties: {
    dioId: {
      type: 'integer',
    },
    name: {
      type: 'string',
      minLength: 3,
    },
    roomId: {
      type: 'string',
      pattern: '[a-z0-9-]{36}',
    },
  },
  required: ['name', 'dioId', 'roomId'],
};
