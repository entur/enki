import { useDispatch } from 'react-redux';
import { setSavedChanges } from 'actions/editor';
import ConfirmDialog from 'components/ConfirmDialog';
import { PrimaryButton, SecondaryButton } from '@entur/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type NavigateConfirmProps = {
  hideDialog: () => void;
  redirectTo: string;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
};

const NavigateConfirmBox = (props: NavigateConfirmProps) => {
  const dispatch = useDispatch();

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
        <SecondaryButton
          key={1}
          onClick={() => {
            props.hideDialog();
            RedirectHandler();
          }}
        >
          {props.confirmText}
        </SecondaryButton>,
        <PrimaryButton key={2} onClick={() => props.hideDialog()}>
          {props.cancelText}
        </PrimaryButton>,
      ]}
      onDismiss={() => props.hideDialog()}
    />
  );
};

export default NavigateConfirmBox;
