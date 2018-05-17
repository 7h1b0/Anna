module.exports = {
  $id: 'user',
  type: 'object',
  additionalProperties: false,
  properties: {
    username: {
      type: 'string',
      minLength: 4,
    },
    password: {
      type: 'string',
      minLength: 4,
    },
  },
  required: ['username', 'password'],
};
