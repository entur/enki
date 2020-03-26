import { toggleDay } from './index';
import { DAY_OF_WEEK } from '../../model/enums';

describe('WeekdayPicker utils', () => {
  describe('toggleDay', () => {
    it('should add day if it is not in the array', () => {
      expect(
        toggleDay(
          [DAY_OF_WEEK.MONDAY, DAY_OF_WEEK.FRIDAY],
          DAY_OF_WEEK.WEDNESDAY
        )
      ).toEqual([
        DAY_OF_WEEK.MONDAY,
        DAY_OF_WEEK.FRIDAY,
        DAY_OF_WEEK.WEDNESDAY,
      ]);
    });

    it('should remove day if it is in the array', () => {
      expect(
        toggleDay([DAY_OF_WEEK.MONDAY, DAY_OF_WEEK.FRIDAY], DAY_OF_WEEK.FRIDAY)
      ).toEqual([DAY_OF_WEEK.MONDAY]);
    });
  });
});
