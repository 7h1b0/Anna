export type HueLight = {
  name: string;
  id: string;
  type: 'Extended color light' | 'Dimmable light';
  state: {
    on: boolean;
    bri: number;
    xy: number[];
  };
};
