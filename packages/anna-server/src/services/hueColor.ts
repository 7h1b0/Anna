type RGB = {
  r: number;
  g: number;
  b: number;
};

/**
 * Converts XY color to HEX color
 */
export function XYToHex(x: number, y: number, brightness = 254): string {
  const z = 1.0 - x - y;
  const Y = roundN(brightness / 254, 2);
  const X = (Y / y) * x;
  const Z = (Y / y) * z;

  //Convert to RGB using Wide RGB D65 conversion
  let red = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
  let green = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
  let blue = X * 0.051713 - Y * 0.121364 + Z * 1.01153;

  //If red, green or blue is larger than 1.0 set it back to the maximum of 1.0
  if (red > blue && red > green && red > 1.0) {
    green = green / red;
    blue = blue / red;
    red = 1.0;
  } else if (green > blue && green > red && green > 1.0) {
    red = red / green;
    blue = blue / green;
    green = 1.0;
  } else if (blue > red && blue > green && blue > 1.0) {
    red = red / blue;
    green = green / blue;
    blue = 1.0;
  }

  //Reverse gamma correction
  red =
    red <= 0.0031308
      ? 12.92 * red
      : (1.0 + 0.055) * Math.pow(red, 1.0 / 2.4) - 0.055;
  green =
    green <= 0.0031308
      ? 12.92 * green
      : (1.0 + 0.055) * Math.pow(green, 1.0 / 2.4) - 0.055;
  blue =
    blue <= 0.0031308
      ? 12.92 * blue
      : (1.0 + 0.055) * Math.pow(blue, 1.0 / 2.4) - 0.055;

  return RGBToHex(
    Math.round(red * 255),
    Math.round(green * 255),
    Math.round(blue * 255),
  );
}

export function isHexColor(hex: string): boolean {
  return /^#?[a-f\d]{2}[a-f\d]{2}[a-f\d]{2}$/i.test(hex);
}

export function hexToRGB(hex: string): RGB | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16),
      }
    : null;
}

export function RGBToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

export function roundN(value: number, precision: number): number {
  const tenToN = 10 ** precision;
  return Math.round(value * tenToN) / tenToN;
}

/**
 * Converts Hex color space to hue XY color
 */
export function hexToXY(color: string): number[] {
  const rgbColor = hexToRGB(color);

  if (!rgbColor) {
    return [0, 0];
  }
  const { r, g, b } = rgbColor;

  //Apply a gamma correction to the RGB values, which makes the color more vivid and more the like the color displayed on the screen of your device
  const red =
    r > 0.04045 ? Math.pow((r + 0.055) / (1.0 + 0.055), 2.4) : r / 12.92;
  const green =
    g > 0.04045 ? Math.pow((g + 0.055) / (1.0 + 0.055), 2.4) : g / 12.92;
  const blue =
    b > 0.04045 ? Math.pow((b + 0.055) / (1.0 + 0.055), 2.4) : b / 12.92;

  //RGB values to XYZ using the Wide RGB D65 conversion formula
  const X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
  const Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
  const Z = red * 0.000088 + green * 0.07231 + blue * 0.986039;

  const x = roundN(X / (X + Y + Z), 4);
  const y = roundN(Y / (X + Y + Z), 4);

  return [x, y];
}
