import { FC, lazy, memo, ReactNode, Suspense, useMemo } from 'react';
import { useConfig } from '../config/ConfigContext';
import { SandboxFeatures } from '../config/config';

/**
 * The base props interface for the SandboxFeature component. It is a generic interface that
 * takes a single type parameter `Features`, and has  a single property `feature` which can
 * have the value of any key of `Features`.
 */
export interface SandboxFeatureProps<Features> {
  feature: keyof Features;
  renderFallback?: () => ReactNode;
}

/**
 * A type that describes a sandbox component which can be wrapped with the SandboxFeature component.
 * It is a generic type which takes two type parameters: `Features` and `Props`. The `Props` type
 * should implement the SandboxFeatureProps interface. The resulting type is a Functional Component
 * with `Props` without "feature".
 */
export type SandboxComponent<
  Features,
  Props extends SandboxFeatureProps<Features>,
> = FC<Omit<Props, 'feature' | 'renderFallback'>>;

/**
 * A component that can load a sandbox Component. It is a generic component with the same type
 * parameters as the SandboxComponent. It optionally and lazily renders the SandboxComponent
 * identified by through the `feature` prop, which identifies the path of the component to load.
 */
const SandboxFeature = <Features, Props extends SandboxFeatureProps<Features>>({
  feature,
  renderFallback,
  ...props
}: Props) => {
  const { sandboxFeatures } = useConfig();

  const splitFeature = (feature as string).split('/');

  let Component: SandboxComponent<Features, Props>;

  if (splitFeature.length > 2) {
    throw new Error('Max feature depth is 2');
  } else if (splitFeature.length === 2) {
    Component = memo(
      lazy(() => import(`./${splitFeature[0]}/${splitFeature[1]}/index.tsx`)),
    );
  } else {
    Component = memo(lazy(() => import(`./${splitFeature[0]}/index.tsx`)));
  }

  const featureEnabled = useMemo(
    () =>
      sandboxFeatures &&
      Object.entries(sandboxFeatures).some(([key, value]) => {
        return key.split('/')[0] === splitFeature[0] && value;
      }),
    [sandboxFeatures, splitFeature],
  );

  return (
    <Suspense>
      {featureEnabled ? (
        <Component {...props} />
      ) : renderFallback ? (
        renderFallback()
      ) : null}
    </Suspense>
  );
};

export default memo(SandboxFeature) as typeof SandboxFeature<
  SandboxFeatures,
  any
>;

export const TestSandboxFeature = memo(SandboxFeature) as typeof SandboxFeature;
