export default {
  $id: 'alias',
  type: 'object',
  additionalProperties: false,
  properties: {
    aliasId: {
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
    sceneId: {
      type: 'integer',
    },
    enabled: { type: 'boolean' },
  },
  required: ['name', 'sceneId'],
};
