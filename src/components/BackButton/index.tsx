import React from 'react';
import { useHistory } from 'react-router-dom';
import { TertiaryButton } from '@entur/button';
import { BackArrowIcon } from '@entur/icons';
import './styles.scss';

type Props = {
  onBackButtonClick?: () => void;
  backButtonTitle?: string;
};

const BackButton = ({ backButtonTitle, onBackButtonClick }: Props) => {
  const history = useHistory();
  return (
    <div className="back-button">
      <TertiaryButton onClick={onBackButtonClick ?? history.goBack}>
        <>
          <BackArrowIcon />
          {backButtonTitle && <div>{backButtonTitle}</div>}
        </>
      </TertiaryButton>
    </div>
  );
};

export default BackButton;
