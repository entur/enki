import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ServiceJourney from 'model/ServiceJourney';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

type Props = {
  open: boolean;
  dismiss: () => void;
  serviceJourneys: ServiceJourney[];
  journeyPatternIndex: number;
  onConfirm: (
    ids: string[],
    serviceJourneys: ServiceJourney[],
    journeyPatternIndex: number,
  ) => void;
};

export default (props: Props) => {
  const { open, dismiss, serviceJourneys, journeyPatternIndex, onConfirm } =
    props;

  const { formatMessage } = useIntl();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [data, setData] = useState<ServiceJourney[]>(serviceJourneys);

  const [filterSearch, setFilterSearch] = React.useState('');

  const filterValidSelectedIds = (filteredJourneys: ServiceJourney[]) => {
    const validIds = new Set(filteredJourneys.map((item) => item.id));
    return (previousIds: string[]) =>
      previousIds.filter((id) => validIds.has(id));
  };

  useEffect(() => {
    const textSearchRegex = new RegExp(
      filterSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i',
    );
    const filtered = serviceJourneys.filter(
      (item) => textSearchRegex.test(item.name!) || filterSearch === '',
    );
    setData(filtered);
    setSelectedIds(filterValidSelectedIds(filtered));
  }, [filterSearch, serviceJourneys]);

  const add = (id: string) => {
    setSelectedIds([...selectedIds, id]);
  };

  const remove = (id: string) => {
    setSelectedIds(selectedIds.filter((v) => v !== id));
  };

  return (
    <Dialog open={open} onClose={dismiss} maxWidth="lg" fullWidth>
      <DialogTitle>
        {formatMessage({ id: 'bulkDeleteDialogTitle' })}
      </DialogTitle>
      <DialogContent>
        <TextField
          label={formatMessage({ id: 'bulkDeleteDialogFilterSearchLabel' })}
          sx={{ width: '15rem' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={filterSearch}
          placeholder=""
          onChange={(e: any) => setFilterSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Table size="small" sx={{ marginTop: '1rem' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedIds.length > 0 && selectedIds.length < data.length
                  }
                  checked={selectedIds.length > 0}
                  onChange={() =>
                    selectedIds.length > 0
                      ? setSelectedIds([])
                      : setSelectedIds(data.map((sj) => sj.id!))
                  }
                />
              </TableCell>
              <TableCell>
                {formatMessage({ id: 'bulkDeleteDialogNameHeader' })}
              </TableCell>
              <TableCell>
                {formatMessage({ id: 'bulkDeleteDialogDepartureHeader' })}
              </TableCell>
              <TableCell>
                {formatMessage({
                  id: 'bulkDeleteDialogDepartureDayOffsetHeader',
                })}
              </TableCell>
              <TableCell>
                {formatMessage({ id: 'bulkDeleteDialogValidityHeader' })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((sj, index) => (
              <TableRow key={index}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(sj.id!)}
                    onChange={() =>
                      selectedIds.includes(sj.id!)
                        ? remove(sj.id!)
                        : add(sj.id!)
                    }
                  />
                </TableCell>
                <TableCell>{sj.name}</TableCell>
                <TableCell>{sj.passingTimes[0].departureTime}</TableCell>
                <TableCell>{sj.passingTimes[0].departureDayOffset}</TableCell>
                <TableCell>
                  {sj.dayTypes?.map((dt) => (
                    <Typography variant="body2" key={dt.daysOfWeek.join()}>
                      <strong>{dt.daysOfWeek.join(' ')}: </strong>
                      {dt.dayTypeAssignments.map((dta, index) => (
                        <span key={index}>
                          {dta.operatingPeriod.fromDate} -{' '}
                          {dta.operatingPeriod.toDate}
                        </span>
                      ))}
                    </Typography>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => dismiss()}>
          {formatMessage({ id: 'bulkDeleteDialogCancelButtonLabel' })}
        </Button>
        <Button
          variant="contained"
          disabled={selectedIds.length === 0}
          onClick={() =>
            onConfirm(selectedIds, serviceJourneys, journeyPatternIndex)
          }
        >
          {formatMessage({ id: 'bulkDeleteDialogConfirmButtonLabel' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
