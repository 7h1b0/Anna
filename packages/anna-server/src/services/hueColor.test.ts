import {
  isHexColor,
  hexToXY,
  XYToHex,
  hexToRGB,
  roundN,
  RGBToHex,
} from './hueColor';

describe('HueColor', () => {
  describe('hexToRGB', () => {
    it.each([
      ['#337704', { r: 51, g: 119, b: 4 }],
      ['#DC4735', { r: 220, g: 71, b: 53 }],
      ['#3684C1', { r: 54, g: 132, b: 193 }],
    ])('should convert %s to rgb', (hexColor, rgbColor) => {
      expect(hexToRGB(hexColor as string)).toEqual(rgbColor);
    });

    it('should handle malformed hex color', () => {
      expect(hexToRGB('')).toBeNull();
    });
  });

  describe('RGBtoHex', () => {
    it.each([
      [51, 119, 4, '#337704'],
      [220, 71, 53, '#DC4735'],
      [54, 132, 193, '#3684C1'],
    ])('should convert %s to rgb', (r, g, b, hexColor) => {
      expect(RGBToHex(r as number, g as number, b as number)).toEqual(hexColor);
    });
  });

  describe('roundN', () => {
    it.each([
      [1.05, 1, 1.1],
      [2.56011, 4, 2.5601],
      [2, 10, 2],
    ])('should round %f after %i decimals', (number, precission, expected) => {
      expect(roundN(number, precission)).toBe(expected);
    });
  });

  describe('hexToXY', () => {
    it.each([
      ['#EFF7FF', [0.308, 0.3207]],
      ['#892BE2', [0.2436, 0.0972]],
      ['#008C8C', [0.1513, 0.3425]],
    ])('should convert %s to xy', (hexColor, xyColor) => {
      expect(hexToXY(hexColor as string)).toEqual(xyColor);
    });
  });

  describe('XYToHex', () => {
    it.each([
      [[0.308, 0.3207], '#EEF7FF'],
      [[0.2436, 0.0972], '#9525FF'],
      [[0.1513, 0.3425], '#00FFFF'],
    ])('should convert %s to hexColor', ([x, y], hexColor) => {
      expect(XYToHex(x as number, y as number)).toEqual(hexColor);
    });
  });

  describe('isHexColor', () => {
    it.each([
      [true, '#EEF7FF'],
      [true, '#9525FF'],
      [true, '#00FFFF'],
      [false, '#00FFFFF'],
      [false, ''],
    ])('should return %s given %s', (expected, hexColor) => {
      expect(isHexColor(hexColor as string)).toBe(expected);
    });
  });
});
