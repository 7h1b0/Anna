import { v4 as uuidv4 } from 'uuid';
import { User } from '../src/modules/user/model';
import { Routine } from '../src/modules/routine/model';

export function createUser(user: Partial<User> = {}): User {
  return {
    username: 'test',
    password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O',
    token: 'token_test',
    userId: uuidv4(),
    ...user,
  };
}

export function uuid() {
  return uuidv4();
}

export function createRoutine(options: Partial<Routine> = {}): Routine {
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
    routineId: 'routineId',
    sceneId: 'sceneId',
    name: 'this_is_a_name',
    interval: '* * * * * *',
    nextRunAt: new Date(),
    createdBy: 'test',
    enabled: true,
    runAtBankHoliday: true,
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
