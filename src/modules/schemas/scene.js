const { TYPES } = require('../type');

module.exports = {
  $id: 'scene',
  type: 'object',
  additionalProperties: false,
  properties: {
    sceneId: {
      type: 'integer',
    },
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
            targetId: {
              type: 'integer',
            },
            actionId: {
              type: 'integer',
            },
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
          required: ['targetId', 'name', 'type'],
        },
      ],
    },
  },
  required: ['name', 'actions'],
};
