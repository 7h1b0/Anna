export default {
  $id: 'routine',
  type: 'object',
  additionalProperties: false,
  properties: {
    routineId: { type: 'integer' },
    name: {
      type: 'string',
      minLength: 3,
    },
    interval: { type: 'string' },
    sceneId: { type: 'integer' },
    enabled: { type: 'boolean' },
    runAtBankHoliday: { type: 'boolean' },
    createdAt: { type: 'integer' },
    updatedAt: { type: 'integer' },
    failedAt: { type: 'integer' },
    lastRunAt: { type: 'integer' },
    nextRunAt: { type: 'integer' },
    createdBy: { type: 'integer' },
  },
  required: ['name', 'sceneId', 'schedule'],
};
