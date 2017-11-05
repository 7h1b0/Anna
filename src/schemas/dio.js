module.exports = {
  $id: 'dio',
  type: 'object',
  additionalProperties: false,
  properties: {
    id_dio: {
      type: 'integer',
    },
    name: {
      type: 'string',
      minLength: 3,
    },
  },
  required: ['name', 'id_dio'],
};
