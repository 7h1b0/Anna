module.exports = {
  $id: 'alias',
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-z_]{5,}$',
    },
    description: {
      type: 'string',
      minLength: 5,
    },
    sceneId: {
      type: 'string',
      pattern: '^[0-9a-z]{24}$',
    },
    enabled: { type: 'boolean' },
  },
  required: ['name', 'sceneId'],
};
