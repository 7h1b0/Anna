export default {
  $id: 'alias',
  type: 'object',
  additionalProperties: false,
  properties: {
    aliasId: {
      type: 'string',
      format: 'uuid',
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
      type: 'string',
      format: 'uuid',
    },
    enabled: { type: 'boolean' },
  },
  required: ['name', 'sceneId'],
};
