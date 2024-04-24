import { FC, lazy, memo, Suspense, useMemo } from 'react';
import { useConfig } from '../config/ConfigContext';
import { SandboxFeatures } from '../config/config';

export interface SandboxFeatureProps {
  feature: keyof SandboxFeatures;
}

export type SandboxComponent<T extends SandboxFeatureProps> = FC<
  Omit<T, 'feature'>
>;

/**
 * A component that can load a sandbox Component lazily, which enables code splitting, each
 * feature get its own chunk.
 *
 * Requirements:
 * 1. Your sandbox component must conform to the SandboxComponent type
 * 2. Your must export a props interface that extends SandboxFeatureProps
 * 3. The feature prop must be identical to the name of the folder
 *    that contains the component
 * 4. The folder must have an index.ts file whose default export is your component
 * 5. The folder must have a types.d.ts file which contains the type declaration
 *    for the component's props, which extends SandboxFeatureProps
 */
const SandboxFeature = <T extends SandboxFeatureProps>({
  feature,
  ...props
}: T) => {
  const { sandboxFeatures } = useConfig();

  const splitFeature = feature.split('/');

  let Component: SandboxComponent<T>;

  if (splitFeature.length > 2) {
    throw new Error('Max feature depth is 2');
  } else if (splitFeature.length === 2) {
    Component = memo(
      lazy(
        () => import(`../ext/${splitFeature[0]}/${splitFeature[1]}/index.ts`),
      ),
    );
  } else {
    Component = memo(lazy(() => import(`../ext/${splitFeature[0]}/index.ts`)));
  }

  const featureEnabled = useMemo(
    () =>
      sandboxFeatures &&
      Object.entries(sandboxFeatures).some(([key, value]) => {
        return key.split('/')[0] === splitFeature[0] && value;
      }),
    [sandboxFeatures, splitFeature],
  );

  return <Suspense>{featureEnabled && <Component {...props} />}</Suspense>;
};

export default memo(SandboxFeature) as typeof SandboxFeature;
