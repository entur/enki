import { prettyDOM, render, screen } from '@testing-library/react';
import { TestSandboxFeature } from './index';
import { ConfigContext } from 'config/ConfigContext';

describe('SandboxFeature', () => {
  it('should render nothing if feature is turned off', () => {
    const { container } = render(
      <ConfigContext.Provider
        value={{
          sandboxFeatures: {
            // @ts-ignore
            '__tests__/testcomponent': false,
          },
        }}
      >
        <TestSandboxFeature feature="__tests__/testcomponent" />
      </ConfigContext.Provider>,
    );

    const treeString = prettyDOM(container);

    expect(treeString).toMatchInlineSnapshot(`"[36m<div />[39m"`);
  });

  it('should render correctly when feature is turned on', async () => {
    render(
      <ConfigContext.Provider
        value={{
          sandboxFeatures: {
            // @ts-ignore
            '__tests__/testcomponent': true,
          },
        }}
      >
        <TestSandboxFeature feature="__tests__/testcomponent" />
      </ConfigContext.Provider>,
    );

    await screen.findByTestId('TestComponentHeader');

    expect(screen.getByTestId('TestComponentHeader')).toHaveTextContent(
      'Hello world',
    );
  });
});
