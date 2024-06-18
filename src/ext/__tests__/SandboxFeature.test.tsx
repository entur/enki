import { ConfigContext } from '../../config/ConfigContext';
import { TestSandboxFeature } from '../SandboxFeature';
import { prettyDOM, render, screen, waitFor } from '@testing-library/react';
import { Features, TestComponentProps } from './index';

describe('SandboxFeature', () => {
  it('should render nothing if feature is turned off', () => {
    const { container } = render(
      <ConfigContext.Provider
        value={{
          sandboxFeatures: {
            '__tests__/testcomponent': false,
          },
        }}
      >
        <TestSandboxFeature<
          Features,
          TestComponentProps
        > feature="__tests__/testcomponent" />
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
            '__tests__/testcomponent': true,
          },
        }}
      >
        <TestSandboxFeature<
          Features,
          TestComponentProps
        > feature="__tests__/testcomponent" />
      </ConfigContext.Provider>,
    );

    await screen.findByTestId('TestComponentHeader');

    expect(screen.getByTestId('TestComponentHeader')).toHaveTextContent(
      'Hello world',
    );
  });
});
