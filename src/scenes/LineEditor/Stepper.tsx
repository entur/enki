import React, { useState, ReactElement } from 'react';
import { Stepper } from '@entur/menu';
import NavigationButtons from './NavigationButtons';
import ConfirmNavigationDialog from 'components/ConfirmNavigationDialog';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';

type Props = {
  steps: string[];
  isValidStepIndex: (i: number) => boolean;
  currentStepIsValid: (i: number) => boolean;
  isEdit: boolean;
  setNextClicked: (b: boolean) => void;
  onDelete: () => void;
  onSave: () => void;
  isSaved: boolean;
  redirect: () => void;
  redirectTo: string;
  children: (arg: number) => ReactElement;
};

export default ({
  steps,
  isValidStepIndex,
  currentStepIsValid,
  isEdit,
  setNextClicked,
  onDelete,
  onSave,
  isSaved,
  redirect,
  redirectTo,
  children,
}: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const [activeStepperIndex, setActiveStepperIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

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

  const onCancel = () => (isSaved ? redirect() : setShowConfirm(true));

  return (
    <>
      <Stepper
        steps={steps}
        activeIndex={activeStepperIndex}
        onStepClick={(index) => onStepClicked(index)}
      />
      {children(activeStepperIndex)}
      <NavigationButtons
        editMode={isEdit}
        firstStep={activeStepperIndex === 0}
        lastStep={activeStepperIndex === steps.length - 1}
        onDelete={onDelete}
        onSave={onSave}
        onNext={onNextClicked}
        onCancel={onCancel}
        onPrevious={() => {
          setActiveStepperIndex(Math.max(activeStepperIndex - 1, 0));
        }}
      />
      {showConfirm && (
        <ConfirmNavigationDialog
          hideDialog={() => setShowConfirm(false)}
          redirectTo={redirectTo}
          title={formatMessage('redirectTitle')}
          description={formatMessage('redirectMessage')}
          confirmText={formatMessage('redirectYes')}
          cancelText={formatMessage('redirectNo')}
        />
      )}
    </>
  );
};
