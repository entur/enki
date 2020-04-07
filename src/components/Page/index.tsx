import React, { ReactElement } from 'react';
import { Heading1 } from '@entur/typography';
import './styles.scss';
import { useHistory } from 'react-router-dom';
import { TertiaryButton } from '@entur/button';
import { BackArrowIcon } from '@entur/icons';

type Props = {
  title?: string;
  children: ReactElement;
  backButtonTitle: string;
  onBackButtonClick?: () => void;
  className?: string;
};

const Page = ({
  title,
  backButtonTitle,
  onBackButtonClick,
  children,
  className = '',
}: Props) => {
  const history = useHistory();
  return (
    <div className={`page ${className}`}>
      <div className="back-button">
        <TertiaryButton onClick={onBackButtonClick ?? history.goBack}>
          <>
            <BackArrowIcon />
            {backButtonTitle && <div>{backButtonTitle}</div>}
          </>
        </TertiaryButton>
      </div>
      <div className="page-content">
        {title && <Heading1>{title}</Heading1>}
        {children}
      </div>
    </div>
  );
};

export default Page;
