import React, { useState } from 'react';
import { Modal } from '@entur/modal';
import { ButtonGroup, PrimaryButton, SecondaryButton } from '@entur/button';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { StrongText, SubParagraph } from '@entur/typography';
import ServiceJourney from 'model/ServiceJourney';
import { Checkbox } from '@entur/form';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';

type Props = {
  open: boolean;
  dismiss: () => void;
  serviceJourneys: ServiceJourney[];
  journeyPatternIndex: number;
  onConfirm: (
    ids: string[],
    serviceJourneys: ServiceJourney[],
    journeyPatternIndex: number
  ) => void;
};

export default (props: Props) => {
  const {
    open,
    dismiss,
    serviceJourneys,
    journeyPatternIndex,
    onConfirm,
  } = props;

  const { formatMessage } = useSelector(selectIntl);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const add = (id: string) => {
    setSelectedIds([...selectedIds, id]);
  };

  const remove = (id: string) => {
    setSelectedIds(selectedIds.filter((v) => v !== id));
  };

  return (
    <Modal
      open={open}
      size="extraLarge"
      title={formatMessage('bulkDeleteDialogTitle')}
      onDismiss={dismiss}
    >
      <Table spacing="small">
        <TableHead>
          <HeaderCell padding="checkbox">
            <Checkbox
              name="all"
              checked={
                selectedIds.length > 0 &&
                selectedIds.length < serviceJourneys.length
                  ? 'indeterminate'
                  : selectedIds.length > 0
              }
              onChange={() =>
                selectedIds.length > 0
                  ? setSelectedIds([])
                  : setSelectedIds(serviceJourneys.map((sj) => sj.id!))
              }
            />
          </HeaderCell>
          <HeaderCell>{formatMessage('bulkDeleteDialogNameHeader')}</HeaderCell>
          <HeaderCell>
            {formatMessage('bulkDeleteDialogDepartureHeader')}
          </HeaderCell>
          <HeaderCell>
            {formatMessage('bulkDeleteDialogDepartureDayOffsetHeader')}
          </HeaderCell>
          <HeaderCell>
            {formatMessage('bulkDeleteDialogValidityHeader')}
          </HeaderCell>
        </TableHead>
        <TableBody>
          {serviceJourneys.map((sj, index) => (
            <TableRow key={index}>
              <DataCell>
                <Checkbox
                  name={sj.name}
                  checked={selectedIds.includes(sj.id!)}
                  onChange={() =>
                    selectedIds.includes(sj.id!) ? remove(sj.id!) : add(sj.id!)
                  }
                />
              </DataCell>
              <DataCell>{sj.name}</DataCell>
              <DataCell>{sj.passingTimes[0].departureTime}</DataCell>
              <DataCell>{sj.passingTimes[0].departureDayOffset}</DataCell>
              <DataCell>
                {sj.dayTypes?.map((dt) => (
                  <SubParagraph>
                    <StrongText>{dt.daysOfWeek.join(' ')}: </StrongText>
                    {dt.dayTypeAssignments.map((dta, index) => (
                      <span key={index}>
                        {dta.operatingPeriod.fromDate} - {' '}
                        {dta.operatingPeriod.toDate}
                      </span>
                    ))}
                  </SubParagraph>
                ))}
              </DataCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ButtonGroup>
        <SecondaryButton onClick={() => dismiss()}>
          {formatMessage('bulkDeleteDialogCancelButtonLabel')}
        </SecondaryButton>
        <PrimaryButton
          disabled={selectedIds.length === 0}
          onClick={() =>
            onConfirm(selectedIds, serviceJourneys, journeyPatternIndex)
          }
        >
          {formatMessage('bulkDeleteDialogConfirmButtonLabel')}
        </PrimaryButton>
      </ButtonGroup>
    </Modal>
  );
};
