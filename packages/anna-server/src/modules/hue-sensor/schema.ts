export default {
  $id: 'sensor',
  type: 'object',
  additionalProperties: false,
  properties: {
    sensorId: {
      type: 'string',
    },
    roomId: {
      type: 'string',
      pattern: '[a-z0-9-]{36}',
    },
  },
  required: ['sensorId', 'roomId'],
};
