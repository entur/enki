import React, { useState, ReactElement } from 'react';
import { Stepper } from '@entur/menu';
import NavigationButtons from './NavigationButtons';

type Props = {
  steps: string[];
  isValidStepIndex: (i: number) => boolean;
  currentStepIsValid: (i: number) => boolean;
  isEdit: boolean;
  setNextClicked: (b: boolean) => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  children: (
    arg: [number, React.Dispatch<React.SetStateAction<number>>]
  ) => ReactElement;
};

export default ({
  steps,
  isValidStepIndex,
  currentStepIsValid,
  isEdit,
  setNextClicked,
  onDelete,
  onSave,
  onCancel,
  children,
}: Props) => {
  const [activeStepperIndex, setActiveStepperIndex] = useState(0);

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

  return (
    <>
      <Stepper
        steps={steps}
        activeIndex={activeStepperIndex}
        onStepClick={(index) => onStepClicked(index)}
      />
      {children([activeStepperIndex, setActiveStepperIndex])}
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
    </>
  );
};
