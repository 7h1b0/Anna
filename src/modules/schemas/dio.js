module.exports = {
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
      type: 'integer',
    },
  },
  required: ['name', 'dioId', 'roomId'],
};
