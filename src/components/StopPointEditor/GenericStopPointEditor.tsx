import { SecondaryButton, SuccessButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { NormalizedDropdownItemType } from '@entur/dropdown/dist/useNormalizedItems';
import { TextField } from '@entur/form';
import { Paragraph } from '@entur/typography';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateStopPoint } from 'helpers/validation';
import usePristine from 'hooks/usePristine';
import { AppIntlState, selectIntl } from 'i18n';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlobalState } from 'reducers';
import { StopPointEditorProps } from '.';
import { QuayRefField } from './QuayRefField';
import './styles.scss';

export const GenericStopPointEditor = ({
  order,
  stopPoint,
  spoilPristine,
  isFirst,
  isLast,
  onChange,
  onDelete,
  canDelete,
}: StopPointEditorProps) => {
  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);
  const {
    flexibleStopPlaceRefAndQuayRef: flexibleStopPlaceRefAndQuayRefError,
    boarding: boardingError,
    frontText: frontTextError,
  } = validateStopPoint(stopPoint, isFirst, isLast);
  const quayRefPristine = usePristine(stopPoint.quayRef, spoilPristine);
  const frontTextPristine = usePristine(
    stopPoint.destinationDisplay?.frontText,
    spoilPristine
  );

  const boardingItems = useMemo(
    () => [
      { value: '0', label: formatMessage('labelForBoarding') },
      { value: '1', label: formatMessage('labelForAlighting') },
      {
        value: '2',
        label: formatMessage('labelForBoardingAndAlighting'),
      },
    ],
    [formatMessage]
  );

  const selectedBoardingItem = useMemo((): string | undefined => {
    if (stopPoint.forBoarding && stopPoint.forAlighting) return '2';
    else if (stopPoint.forBoarding) return '0';
    else if (stopPoint.forAlighting) return '1';
    else return undefined;
  }, [stopPoint]);

  const onQuayRefChange = useCallback(
    (quayRef: string) => onChange({ ...stopPoint, quayRef }),
    [onChange, stopPoint]
  );

  const onFrontTextChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      onChange({
        ...stopPoint,
        destinationDisplay: e.target.value
          ? { frontText: e.target.value }
          : null,
      }),
    [onChange, stopPoint]
  );

  const onBoardingChange = useCallback(
    (element: NormalizedDropdownItemType | null) =>
      onChange({
        ...stopPoint,
        forBoarding: element?.value
          ? element?.value === '0' || element?.value === '2'
          : null,
        forAlighting: element?.value
          ? element?.value === '1' || element?.value === '2'
          : null,
      }),
    [onChange, stopPoint]
  );

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div className="stop-point">
      <div className="stop-point-element">
        <div className="stop-point-key-info">
          <Paragraph>{order}</Paragraph>
        </div>
        <div className="stop-point-info">
          <QuayRefField
            initialQuayRef={stopPoint.quayRef}
            errorFeedback={getErrorFeedback(
              flexibleStopPlaceRefAndQuayRefError
                ? formatMessage(flexibleStopPlaceRefAndQuayRefError)
                : '',
              !flexibleStopPlaceRefAndQuayRefError,
              quayRefPristine
            )}
            onChange={onQuayRefChange}
          />
          <TextField
            className="stop-point-info-item"
            label={formatMessage(
              isFirst ? 'labelFrontTextRequired' : 'labelFrontText'
            )}
            {...getErrorFeedback(
              frontTextError ? formatMessage(frontTextError) : '',
              !frontTextError,
              frontTextPristine
            )}
            disabled={isLast}
            labelTooltip={formatMessage('frontTextTooltip')}
            value={stopPoint.destinationDisplay?.frontText}
            onChange={onFrontTextChange}
          />

          <Dropdown
            className="stop-point-info-item"
            label={formatMessage('labelBoarding')}
            value={selectedBoardingItem}
            placeholder={formatMessage('defaultOption')}
            onChange={onBoardingChange}
            items={boardingItems}
            feedback={boardingError && formatMessage(boardingError)}
            variant={boardingError ? 'error' : undefined}
          />
        </div>

        <DeleteButton
          disabled={!canDelete}
          onClick={() => setDeleteDialogOpen(true)}
          title={formatMessage('editorDeleteButtonText')}
        />

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title={formatMessage('deleteStopPointDialogTitle')}
          message={formatMessage('deleteStopPointDialogMessage')}
          buttons={[
            <SecondaryButton
              key="no"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {formatMessage('no')}
            </SecondaryButton>,
            <SuccessButton key="yes" onClick={onDelete}>
              {formatMessage('yes')}
            </SuccessButton>,
          ]}
          onDismiss={() => setDeleteDialogOpen(false)}
        />
      </div>
    </div>
  );
};
