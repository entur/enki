import './styles.scss';
import { FloatingButton } from '@entur/button';
import { UndoIcon } from '@entur/icons';
import DefaultMapContainer from './DefaultMapContainer';

type Props = {
  undo: () => void;
  children: React.ReactElement;
};

const FormMap = (props: Props) => {
  return (
    <div className="map-container eds-contrast">
      <DefaultMapContainer>{props.children}</DefaultMapContainer>

      <FloatingButton
        className="undo-button"
        size="small"
        aria-label="Undo"
        onClick={props.undo}
      >
        <UndoIcon />
      </FloatingButton>
    </div>
  );
};

export default FormMap;
