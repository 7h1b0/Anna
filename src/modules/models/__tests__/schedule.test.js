const Schedule = require('../schedule');

describe('Schedule', () => {
  describe('isPublicHoliday', () => {
    it('should return true on public holidays', () => {
      const feteNationale = new Date(2012, 6, 14).getTime();
      expect(Schedule.isPublicHoliday(feteNationale)).toBeTruthy();

      const lundiDePaques = new Date(2019, 3, 22).getTime();
      expect(Schedule.isPublicHoliday(lundiDePaques)).toBeTruthy();

      const ascension = new Date(2020, 4, 21).getTime();
      expect(Schedule.isPublicHoliday(ascension)).toBeTruthy();
    });

    it('should return false on every day except public holidays', () => {
      const day1 = new Date(2012, 6, 15).getTime();
      expect(Schedule.isPublicHoliday(day1)).toBeFalsy();

      const day2 = new Date(2020, 4, 22).getTime();
      expect(Schedule.isPublicHoliday(day2)).toBeFalsy();
    });
  });
});
