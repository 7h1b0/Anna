export default {
  $id: 'alias',
  type: 'object',
  additionalProperties: false,
  properties: {
    aliasId: {
      type: 'string',
      pattern: '[a-z0-9-]{36}',
    },
    name: {
      type: 'string',
      pattern: '^[a-z_]{4,}$',
    },
    description: {
      type: 'string',
      minLength: 3,
    },
    sceneId: {
      type: 'string',
      pattern: '[a-z0-9-]{36}',
    },
    enabled: { type: 'boolean' },
  },
  required: ['name', 'sceneId'],
};
