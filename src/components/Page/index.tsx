import { TertiaryButton } from '@entur/button';
import { BackArrowIcon } from '@entur/icons';
import { Heading1 } from '@entur/typography';
import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

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
  const navigate = useNavigate();
  return (
    <div className={`page ${className}`}>
      <div className="back-button">
        <TertiaryButton
          onClick={() =>
            onBackButtonClick ? onBackButtonClick() : navigate(-1)
          }
        >
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
