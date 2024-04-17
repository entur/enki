import { SandboxFeatureProps } from '../../../config/SandboxFeature';
import { RedirectType } from '../../../scenes/App/components/NavBar';

export interface DayTypesEditorNavBarItemProps extends SandboxFeatureProps {
  feature: 'daytypes-editor/nav-bar-item';
  setRedirect: (redirect: RedirectType) => void;
}
