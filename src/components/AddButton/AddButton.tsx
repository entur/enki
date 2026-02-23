import Add from '@mui/icons-material/Add';
import { Box, IconButton, Typography } from '@mui/material';

type Props = {
  onClick: () => void;
  buttonTitle: string;
};

const AddButton = (props: Props) => (
  <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 6 }}>
    <IconButton onClick={props.onClick} sx={{ mr: 2 }} color="primary">
      <Add />
    </IconButton>
    <Typography variant="body1">{props.buttonTitle}</Typography>
  </Box>
);

export default AddButton;
