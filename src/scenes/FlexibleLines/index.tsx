import Add from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { deleteLine, loadFlexibleLines } from 'actions/flexibleLines';
import ConfirmDialog from 'components/ConfirmDialog';
import LinesTable from 'components/LinesTable';
import FlexibleLine from 'model/FlexibleLine';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default () => {
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [selectedLine, setSelectedLine] = useState<FlexibleLine | undefined>(
    undefined,
  );
  const intl = useIntl();
  const { formatMessage } = intl;
  const lines = useAppSelector((state) => state.flexibleLines);
  const operator = useAppSelector((state) => state.organisations);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadFlexibleLines(intl));
  }, [dispatch]);

  const navigate = useNavigate();

  const handleOnRowClick = (line: FlexibleLine) =>
    navigate(`/flexible-lines/edit/${line.id}`);
  const handleOnRowDeleteClick = (line: FlexibleLine) => {
    setSelectedLine(line);
    setShowDeleteDialogue(true);
  };

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <Typography variant="h1">
        {formatMessage({ id: 'flexibleLinesHeader' })}
      </Typography>

      <Button
        variant="outlined"
        component={Link}
        to="/flexible-lines/create"
        sx={{ alignSelf: 'flex-start' }}
      >
        <Add />
        {formatMessage({ id: 'linesCreateFlexibleLineIconButtonLabel' })}
      </Button>

      <LinesTable
        lines={lines!}
        organisations={operator!}
        onRowClick={handleOnRowClick}
        onDeleteRowClick={handleOnRowDeleteClick}
      />

      {showDeleteDialogue && selectedLine && (
        <ConfirmDialog
          isOpen
          onDismiss={() => {
            setSelectedLine(undefined);
            setShowDeleteDialogue(false);
          }}
          title={formatMessage({
            id: 'editorDeleteLineConfirmationDialogTitle',
          })}
          message={formatMessage({
            id: 'editorDeleteLineConfirmationDialogMessage',
          })}
          buttons={[
            <Button
              variant="outlined"
              key="no"
              onClick={() => {
                setSelectedLine(undefined);
                setShowDeleteDialogue(false);
              }}
            >
              {formatMessage({ id: 'no' })}
            </Button>,
            <Button
              variant="contained"
              color="error"
              key="yes"
              onClick={() => {
                dispatch(deleteLine(selectedLine, intl))
                  .then(() => {
                    setSelectedLine(undefined);
                    setShowDeleteDialogue(false);
                  })
                  .then(() => dispatch(loadFlexibleLines(intl)));
              }}
            >
              {formatMessage({ id: 'yes' })}
            </Button>,
          ]}
        />
      )}
    </Stack>
  );
};
