import { Button } from '@mui/material';
import { setSavedChanges } from 'actions/editor';
import ConfirmDialog from 'components/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store/hooks';

type NavigateConfirmProps = {
  hideDialog: () => void;
  redirectTo: string;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
};

const NavigateConfirmBox = (props: NavigateConfirmProps) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const RedirectHandler = () => {
    dispatch(setSavedChanges(true));
    navigate(props.redirectTo);
  };

  return (
    <ConfirmDialog
      isOpen
      title={props.title}
      message={props.description}
      buttons={[
        <Button
          key={1}
          variant="outlined"
          onClick={() => {
            props.hideDialog();
            RedirectHandler();
          }}
        >
          {props.confirmText}
        </Button>,
        <Button key={2} variant="contained" onClick={() => props.hideDialog()}>
          {props.cancelText}
        </Button>,
      ]}
      onDismiss={() => props.hideDialog()}
    />
  );
};

export default NavigateConfirmBox;
