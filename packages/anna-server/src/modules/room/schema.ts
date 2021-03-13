export default {
  $id: 'room',
  type: 'object',
  additionalProperties: false,
  properties: {
    roomId: {
      type: 'string',
      pattern: '[a-z0-9-]{36}',
    },
    name: {
      type: 'string',
      minLength: 3,
    },
    description: {
      type: 'string',
      minLength: 3,
    },
  },
  required: ['name'],
};
