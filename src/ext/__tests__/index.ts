import { SandboxFeatureProps } from '../SandboxFeature';

export interface TestFeatures {
  '__tests__/testcomponent': boolean;
}

export interface TestComponentProps extends SandboxFeatureProps<TestFeatures> {}
