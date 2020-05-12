export type Sensor = {
  id: string;
  state: {
    temperature: number;
    lastupdated: string;
  };
  type: 'ZLLTemperature';
};
