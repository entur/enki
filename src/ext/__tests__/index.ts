import { _SandboxFeature, SandboxFeatureProps } from '../SandboxFeature';
import { memo } from 'react';

export interface TestFeatures {
  '__tests__/testcomponent'?: boolean;
}

export interface TestComponentProps extends SandboxFeatureProps<TestFeatures> {}

export const TestSandboxFeature = memo(
  _SandboxFeature,
) as typeof _SandboxFeature<TestFeatures, any>;
