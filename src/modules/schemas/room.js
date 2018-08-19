export default {
  $id: 'room',
  type: 'object',
  additionalProperties: false,
  properties: {
    roomId: {
      type: 'integer',
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
