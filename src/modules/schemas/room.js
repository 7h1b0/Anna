module.exports = {
  $id: 'room',
  type: 'object',
  additionalProperties: false,
  properties: {
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
