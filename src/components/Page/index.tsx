import ArrowBack from '@mui/icons-material/ArrowBack';
import { Button, Typography } from '@mui/material';
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
        <Button
          variant="text"
          onClick={() =>
            onBackButtonClick ? onBackButtonClick() : navigate(-1)
          }
        >
          <>
            <ArrowBack />
            {backButtonTitle && <div>{backButtonTitle}</div>}
          </>
        </Button>
      </div>
      <div className="page-content">
        {title && <Typography variant="h1">{title}</Typography>}
        {children}
      </div>
    </div>
  );
};

export default Page;
