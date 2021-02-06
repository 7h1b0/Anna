export type HueLight = {
  name: string;
  id: string;
  type: 'Extended color light' | 'Dimmable light';
  state: HueLightState;
};

export type HueLightState = {
  on: boolean;
  bri: number;
  xy?: number[];
  hex?: string;
};
