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
      format: 'uuid',
    },
  },
  required: ['sensorId', 'roomId'],
};
