import React from 'react';
import { useHistory } from 'react-router-dom';
import { TertiaryButton } from '@entur/button';
import { BackArrowIcon } from '@entur/icons';
import { Heading1 as H1 } from '@entur/typography';
import './styles.scss';

type PageHeaderProps = {
  title?: string;
  withBackButton: boolean;
  onBackButtonClick?: () => void;
  backButtonTitle?: string;
};

const PageHeader = ({
  title,
  withBackButton,
  backButtonTitle,
  onBackButtonClick
}: PageHeaderProps) => {
  const history = useHistory();
  return (
    <div className="page-header">
      {withBackButton && (
        <div className="back-button">
          <TertiaryButton onClick={onBackButtonClick ?? history.goBack}>
            <>
              <BackArrowIcon />
              {backButtonTitle && <div>{backButtonTitle}</div>}
            </>
          </TertiaryButton>
        </div>
      )}
      <H1>{title}</H1>
    </div>
  );
};

export default PageHeader;
