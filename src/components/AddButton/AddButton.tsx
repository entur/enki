import Add from '@mui/icons-material/Add';
import { Box, IconButton, Typography } from '@mui/material';

type Props = {
  onClick: () => void;
  buttonTitle: string;
};

const AddButton = (props: Props) => (
  <Box sx={{ display: 'flex', alignItems: 'baseline', mt: '3rem' }}>
    <IconButton
      onClick={props.onClick}
      sx={{ marginRight: '1rem' }}
      color="primary"
    >
      <Add />
    </IconButton>
    <Typography variant="body1">{props.buttonTitle}</Typography>
  </Box>
);

export default AddButton;
