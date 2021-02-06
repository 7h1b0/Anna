export const presets: Preset[] = [
  { name: 'Alice', xy: [0.3088, 0.3212], bri: 250, hex: '#eff7ff' },
  { name: 'Sea green', xy: [0.1979, 0.5005], bri: 250, hex: '#21b2aa' },
  { name: 'Cornflower', xy: [0.1905, 0.1945], bri: 250, hex: '#6393ed' },
  { name: 'Ordchid', xy: [0.3365, 0.1735], bri: 250, hex: '#ba54d3' },
  { name: 'Antique White', xy: [0.3548, 0.3489], bri: 250, hex: '#f9ead6' },
  { name: 'Salmon', xy: [0.5016, 0.3531], bri: 250, hex: '#e8967a' },
  { name: 'Orange', xy: [0.5614, 0.4156], bri: 200, hex: '#ffa500' },
  { name: 'Orange Red', xy: [0.6726, 0.3217], bri: 250, hex: '#ff4400' },
];

export type Preset = {
  name: string;
  xy: number[];
  bri: number;
  hex: string;
};
