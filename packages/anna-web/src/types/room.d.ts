import type { Dio } from 'types/dio';
import type { HueLight } from 'types/hue-light';
import type { Sensor } from 'types/sensors';

export type Room = {
  roomId: string;
  description: string;
  name: string;
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string;
  devices: {
    dios: Array<Dio>;
    hueLights: Array<HueLight>;
  };
  sensors: Sensor[];
};
