import ArrowBack from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

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
}: Props) => {
  const navigate = useNavigate();
  return (
    <Box>
      <Button
        variant="text"
        startIcon={<ArrowBack />}
        onClick={() => (onBackButtonClick ? onBackButtonClick() : navigate(-1))}
        sx={{ mb: 2 }}
      >
        {backButtonTitle}
      </Button>
      <Box sx={{ mx: 6, my: 3 }}>
        {title && (
          <Typography variant="h1" sx={{ mb: 3 }}>
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default Page;
