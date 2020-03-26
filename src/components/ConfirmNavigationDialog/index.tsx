import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSavedChanges } from 'actions/editor';
import ConfirmDialog from 'components/ConfirmDialog';
import { PrimaryButton, SecondaryButton } from '@entur/button';
import React from 'react';

type NavigateConfirmProps = RouteComponentProps & {
  hideDialog: () => void;
  redirectTo: string;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
};

const NavigateConfirmBox = (props: NavigateConfirmProps) => {
  const dispatch = useDispatch();

  const RedirectHandler = () => {
    dispatch(setSavedChanges(true));
    props.history.push(props.redirectTo);
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
        </PrimaryButton>
      ]}
      onDismiss={() => props.hideDialog()}
    />
  );
};

export default withRouter(NavigateConfirmBox);
