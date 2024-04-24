import { SandboxFeatureProps } from '../SandboxFeature';

export type Features = {
  '__tests__/testcomponent'?: boolean;
};

export interface TestComponentProps extends SandboxFeatureProps<Features> {}
