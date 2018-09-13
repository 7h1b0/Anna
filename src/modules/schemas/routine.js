export default {
  $id: 'routine',
  type: 'object',
  additionalProperties: false,
  properties: {
    routineId: {
      type: 'string',
      format: 'uuid',
    },
    name: {
      type: 'string',
      minLength: 3,
    },
    interval: { type: 'string' },
    sceneId: {
      type: 'string',
      format: 'uuid',
    },
    enabled: { type: 'boolean' },
    runAtBankHoliday: { type: 'boolean' },
    createdAt: { type: 'integer' },
    updatedAt: { type: 'integer' },
    failedAt: { type: 'integer' },
    lastRunAt: { type: 'integer' },
    nextRunAt: { type: 'integer' },
    createdBy: {
      type: 'string',
      format: 'uuid',
    },
  },
  required: ['name', 'sceneId', 'interval'],
};
