import { Alert, Button, Stepper, Step, StepButton } from '@mui/material';
import ConfirmDialog from 'components/ConfirmDialog';
import ConfirmNavigationDialog from 'components/ConfirmNavigationDialog';
import OverlayLoader from 'components/OverlayLoader';
import React, { ReactElement, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import NavigationButtons from './NavigationButtons';
import './styles.scss';

type Props = {
  steps: string[];
  isValidStepIndex: (i: number) => boolean;
  currentStepIsValid: (i: number) => boolean;
  isLineValid: boolean;
  isEdit: boolean;
  spoilPristine: boolean;
  setNextClicked: (b: boolean) => void;
  onDelete: () => void;
  isDeleting: boolean;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
  redirectTo: string;
  showConfirm: boolean;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  authoritiesMissing: boolean | null;
  children: (arg: number) => ReactElement;
};

export default ({
  steps,
  isValidStepIndex,
  currentStepIsValid,
  isLineValid,
  isEdit,
  spoilPristine,
  setNextClicked,
  onDelete,
  isDeleting,
  onSave,
  isSaving,
  isSaved,
  redirectTo,
  showConfirm,
  setShowConfirm,
  authoritiesMissing,
  children,
}: Props) => {
  const { formatMessage } = useIntl();
  const [activeStepperIndex, setActiveStepperIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStepperIndex]);

  const onStepClicked = (stepIndexClicked: number) => {
    if (isValidStepIndex(stepIndexClicked)) {
      setActiveStepperIndex(stepIndexClicked);
    }
  };

  const onNextClicked = () => {
    if (currentStepIsValid(activeStepperIndex)) {
      setActiveStepperIndex(activeStepperIndex + 1);
      setNextClicked(false);
    } else {
      setNextClicked(true);
    }
  };

  const onCancel = () =>
    isSaved ? navigate(redirectTo) : setShowConfirm(true);

  const invalidSteps = steps.filter((_, i) => !currentStepIsValid(i));

  const otherStepsHasError =
    invalidSteps.length > 0 &&
    !invalidSteps.includes(steps[activeStepperIndex]);

  return (
    <>
      <Stepper activeStep={activeStepperIndex} nonLinear>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={() => onStepClicked(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div className="line-editor">
        <OverlayLoader
          className=""
          isLoading={isSaving || isDeleting}
          text={
            isSaving
              ? formatMessage({ id: 'editorSaveLineLoadingText' })
              : formatMessage({ id: 'editorDeleteLineLoadingText' })
          }
        >
          <div className="editor-pages">{children(activeStepperIndex)}</div>
          <>
            {otherStepsHasError && spoilPristine && isEdit && (
              <Alert
                className="step-errors"
                severity="error"
                sx={{ width: 'fit-content' }}
              >
                {formatMessage({ id: 'fixErrorsInTheFollowingSteps' })}
                {invalidSteps.join(', ')}
              </Alert>
            )}
          </>
          <NavigationButtons
            editMode={isEdit}
            firstStep={activeStepperIndex === 0}
            lastStep={activeStepperIndex === steps.length - 1}
            currentStepIsValid={currentStepIsValid(activeStepperIndex)}
            isValid={isLineValid}
            onDelete={onDelete}
            onSave={onSave}
            onNext={onNextClicked}
            onCancel={onCancel}
            onPrevious={() => {
              setActiveStepperIndex(Math.max(activeStepperIndex - 1, 0));
            }}
          />
        </OverlayLoader>
      </div>
      {showConfirm && (
        <ConfirmNavigationDialog
          hideDialog={() => setShowConfirm(false)}
          redirectTo={redirectTo}
          title={formatMessage({ id: 'redirectTitle' })}
          description={formatMessage({ id: 'redirectMessage' })}
          confirmText={formatMessage({ id: 'redirectYes' })}
          cancelText={formatMessage({ id: 'redirectNo' })}
        />
      )}
      {authoritiesMissing && (
        <ConfirmDialog
          className="authority-missing-modal"
          isOpen={true}
          title={formatMessage({ id: 'networkAuthorityMissing' })}
          message={formatMessage({ id: 'networkAuthorityMissingDetails' })}
          onDismiss={() => navigate('/')}
          buttons={[
            <Button variant="contained" key="0" onClick={() => navigate('/')}>
              {formatMessage({ id: 'homePage' })}
            </Button>,
          ]}
        />
      )}
    </>
  );
};
