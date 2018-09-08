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
      format: 'uuid',
    },
  },
  required: ['name', 'dioId', 'roomId'],
};
