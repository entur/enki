import { dateToString } from './dates';

describe('dateToString', () => {
  it('should convert a date to formatted string', () => {
    expect(dateToString(new Date('01 31 2020'))).toEqual('2020-01-31');
  });
});
