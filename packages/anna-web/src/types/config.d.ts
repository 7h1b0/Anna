import type { Room } from 'types/room';
import type { Scene } from 'types/scene';
import type { Routine } from 'types/routine';
import type { Trigger } from 'types/trigger';

export type Config = {
  rooms: Room[];
  scenes: Scene[];
  alias: Trigger[];
  routines: Routine[];
};
