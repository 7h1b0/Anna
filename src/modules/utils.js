export function omit(object, props = []) {
  return Object.keys(object).reduce((acc, key) => {
    if (!props.includes(key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {});
}

/**
 * Source
 * http://techneilogy.blogspot.fr/2012/02/couple-of-years-ago-i-posted-source.html
 */
export function isBankHoliday(timestamp) {
  function getPublicHolidays(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const n0 = h + l + 7 * m + 114;
    const month = Math.floor(n0 / 31) - 1;
    const day = (n0 % 31) + 1;

    const jourDeLan = new Date(year, 0, 1);
    const lundiDePaques = new Date(year, month, day + 1);
    const feteDuTravail = new Date(year, 4, 1);
    const victoireDesAllies = new Date(year, 4, 8);
    const ascension = new Date(year, month, day + 39);
    const pentecote = new Date(year, month, day + 50);
    const feteNationale = new Date(year, 6, 14);
    const assomption = new Date(year, 7, 15);
    const toussaint = new Date(year, 10, 1);
    const armistice = new Date(year, 10, 11);
    const noel = new Date(year, 11, 25);

    return [
      jourDeLan,
      lundiDePaques,
      feteDuTravail,
      victoireDesAllies,
      ascension,
      pentecote,
      feteNationale,
      assomption,
      toussaint,
      armistice,
      noel,
    ];
  }

  const date = timestamp ? new Date(timestamp) : new Date();
  date.setHours(0, 0, 0, 0);
  return getPublicHolidays(date.getFullYear()).some(
    holiday => date.getTime() === holiday.getTime(),
  );
}
