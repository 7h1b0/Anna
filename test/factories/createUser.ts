import * as uuidv4 from 'uuid/v4';

export default function createUser(user = {}) {
  const defaultProps = {
    username: 'test',
    password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O',
    token: 'token_test',
    userId: uuidv4(),
  };

  return { ...defaultProps, ...user };
}
