import * as uuidv4 from 'uuid/v4';
import { User } from 'modules/models/user';
import { Routine } from 'modules/models/routine';

export function createUser(user = {}): User {
  const defaultProps = {
    username: 'test',
    password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O',
    token: 'token_test',
    userId: uuidv4(),
  };

  return { ...defaultProps, ...user };
}

export function createRoutine(options = {}): Routine {
  const defaultProps = {
    routineId: 'routineId',
    sceneId: 'sceneId',
    name: 'this_is_a_name',
    interval: '* * * * * *',
    nextRunAt: new Date(),
    createdBy: 'test',
    enabled: true,
    runAtBankHoliday: true,
  };

  const {
    routineId,
    sceneId,
    name,
    interval,
    nextRunAt,
    createdBy,
    enabled,
    runAtBankHoliday,
  } = {
    ...defaultProps,
    ...options,
  };
  return new Routine(
    routineId,
    sceneId,
    name,
    interval,
    nextRunAt,
    createdBy,
    enabled,
    runAtBankHoliday,
  );
}
