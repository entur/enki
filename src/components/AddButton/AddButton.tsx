import Add from '@mui/icons-material/Add';
import { IconButton, Typography } from '@mui/material';

type Props = {
  onClick: () => void;
  buttonTitle: string;
};

const AddButton = (props: Props) => (
  <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '3rem' }}>
    <IconButton
      onClick={props.onClick}
      style={{ marginRight: '1rem' }}
      color="primary"
    >
      <Add />
    </IconButton>
    <Typography variant="body1">{props.buttonTitle}</Typography>
  </div>
);

export default AddButton;
