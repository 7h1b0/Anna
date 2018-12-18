import TYPES from '../type';

export default {
  $id: 'scene',
  type: 'object',
  additionalProperties: false,
  properties: {
    sceneId: {
      type: 'string',
      format: 'uuid',
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
              type: 'number',
            },
            actionId: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
              minLength: 3,
            },
            type: {
              type: 'string',
              enum: [TYPES.DIO, TYPES.HUE_LIGHT],
            },
            body: {
              type: 'object',
              minProperties: 1,
            },
          },
          required: ['targetId', 'body', 'type'],
        },
      ],
    },
  },
  required: ['name', 'actions'],
};
