import React from 'react';
import { Heading1 as H1 } from '@entur/typography';
import './styles.scss';
import BackButton from 'components/BackButton';

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
  onBackButtonClick,
}: PageHeaderProps) => (
  <div className="page-header">
    {withBackButton && (
      <BackButton
        onBackButtonClick={onBackButtonClick}
        backButtonTitle={backButtonTitle}
      />
    )}
    <H1>{title}</H1>
  </div>
);

export default PageHeader;
