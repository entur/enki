import selectActiveProvider from '../selectActiveProvider';
import { Provider } from 'model';

test('selectActiveProvider works', () => {
  const selector = selectActiveProvider();
  const expectedProvider = new Provider({
    code: 'tst'
  });

  expect(
    selector({
      providers: {
        providers: [new Provider({ code: 'foobar' }), expectedProvider],
        active: 'tst'
      }
    })
  ).toBe(expectedProvider);
});
