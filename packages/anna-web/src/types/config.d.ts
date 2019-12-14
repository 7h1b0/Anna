import { Room } from 'types/room';
import { Scene } from 'types/scene';
import { Routine } from 'types/routine';
import { Trigger } from 'types/trigger';

export type Config = {
  rooms: Room[];
  scenes: Scene[];
  alias: Trigger[];
  routines: Routine[];
};
