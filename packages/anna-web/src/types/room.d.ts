import { Dio } from 'types/dio';
import { HueLight } from 'types/hue-light';

export type Room = {
  roomId: string;
  description: string;
  name: string;
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string;
  devices?: {
    dios: Array<Dio>;
    hueLights: Array<HueLight>;
  };
};
