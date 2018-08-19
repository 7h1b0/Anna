export default {
  $id: 'scheduleUpdate',
  type: 'object',
  additionalProperties: true,
  properties: {
    name: {
      type: 'string',
      minLength: 3,
    },
    interval: {
      type: 'string',
    },
    runAtPublicHoliday: {
      type: 'boolean',
    },
  },
  required: ['name', 'interval', 'runAtPublicHoliday'],
};
