const { TYPES } = require('../modules/type');

module.exports = {
  $id: 'scene',
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 3,
    },
    description: {
      type: 'string',
      minLength: 5,
    },
    actions: {
      type: 'array',
      minItems: 1,
      items: [
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: {},
            name: {
              type: 'string',
              minLength: 3,
            },
            type: {
              type: 'string',
              enum: TYPES,
            },
            body: {
              type: 'object',
              minProperties: 1,
            },
          },
          required: ['id', 'name', 'type'],
        },
      ],
    },
  },
  required: ['name', 'actions'],
};
