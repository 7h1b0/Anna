export default {
  $id: 'routine',
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 3,
    },
    interval: { type: 'string' },
    sceneId: {
      type: 'string',
      pattern: '[a-z0-9-]{36}',
    },
    enabled: { type: 'boolean' },
    runAtBankHoliday: { type: 'boolean' },
  },
  required: ['name', 'sceneId', 'interval'],
};
