import selectActiveProvider from '../selectActiveProvider';

test('selectActiveProvider works', () => {
  const selector = selectActiveProvider();
  const expectedProvider = {
    code: 'tst',
  };

  expect(
    selector({
      providers: {
        providers: [{ code: 'foobar' }, expectedProvider],
        active: 'tst',
      },
    })
  ).toBe(expectedProvider);
});
