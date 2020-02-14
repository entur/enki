import React from 'react';
import { useHistory } from 'react-router-dom';
import { SecondarySquareButton } from '@entur/button';
import { BackArrowIcon } from '@entur/icons';
import { Heading1 as H1 } from '@entur/typography';

function BackButton({ onBackButtonClick }: { onBackButtonClick: () => void }) {
  const history = useHistory();
  return (
    <SecondarySquareButton onClick={onBackButtonClick ?? history.goBack}>
      <BackArrowIcon />
    </SecondarySquareButton>
  );
}

type PageHeaderProps = {
  title: string;
  withBackButton: boolean;
  onBackButtonClick: () => void;
};

function PageHeader({
  title,
  withBackButton,
  onBackButtonClick
}: PageHeaderProps) {
  return (
    <div style={{ display: 'flex' }}>
      {withBackButton && (
        <div style={{ marginBottom: '1rem', marginRight: '1rem' }}>
          <BackButton onBackButtonClick={onBackButtonClick} />
        </div>
      )}
      <H1>{title}</H1>
    </div>
  );
}

export default PageHeader;
