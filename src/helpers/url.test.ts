import { normalizeAllUrls } from './url';

describe('normalizeAllUrls', () => {
  it('should modify url if it starts with slash', () => {
    const actual = normalizeAllUrls({
      exception: {
        values: [
          {
            stacktrace: {
              frames: [{ filename: '/chunk.js' }, { filename: 'http://local' }],
            },
          },
        ],
      },
    });
    const expected = {
      exception: {
        values: [
          {
            stacktrace: {
              frames: [
                { filename: 'app:////chunk.js' },
                { filename: 'http://local' },
              ],
            },
          },
        ],
      },
    };
    expect(actual).toStrictEqual(expected);
  });

  it('should not modify url if it starts with anything but a slash', () => {
    const actual = normalizeAllUrls({
      exception: {
        values: [
          {
            stacktrace: {
              frames: [
                { filename: 'http://chunk.js' },
                { filename: 'http://local' },
              ],
            },
          },
        ],
      },
    });
    const expected = {
      exception: {
        values: [
          {
            stacktrace: {
              frames: [
                { filename: 'http://chunk.js' },
                { filename: 'http://local' },
              ],
            },
          },
        ],
      },
    };
    expect(actual).toStrictEqual(expected);
  });

  it('should do nothing if some values are missing', () => {
    const actual = normalizeAllUrls({
      exception: { values: [] },
    });
    const expected = {
      exception: { values: [] },
    };
    expect(actual).toStrictEqual(expected);
  });
});
