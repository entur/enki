import React, { ReactElement } from 'react';
import { Heading1 as H1 } from '@entur/typography';
import BackButton from 'components/BackButton';
import './styles.scss';

type Props = {
  title: string;
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
}: Props) => (
  <div className={`page ${className}`}>
    <BackButton
      onBackButtonClick={onBackButtonClick}
      backButtonTitle={backButtonTitle}
    />
    <div className="page-content">
      <H1>{title}</H1>
      {children}
    </div>
  </div>
);

export default Page;
