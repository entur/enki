import HelpOutline from '@mui/icons-material/HelpOutline';
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { saveExport } from 'actions/exports';
import LinesForExport from 'components/LinesForExport';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import RequiredInputMarker from 'components/RequiredInputMarker';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
import { isBlank } from 'helpers/forms';
import usePristine from 'hooks/usePristine';
import { Export, ExportLineAssociation, newExport } from 'model/Export';
import { ChangeEvent, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import Box from '@mui/material/Box';
import { exportIsValid } from './validateForm';
import { useConfig } from '../../../config/ConfigContext';

const ExportsCreator = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
  const [saveClicked, setSaveClicked] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const config = useConfig();
  const [theExport, setTheExport] = useState<Export>(
    newExport(
      config.exportGenerateServiceLinksDefault,
      config.exportIncludeDatedServiceJourneysDefault,
    ),
  );
  const { hideExportDryRun } = useConfig();

  const dispatch = useAppDispatch();

  const namePristine = usePristine(theExport.name, saveClicked);

  const handleOnSaveClick = () => {
    if (exportIsValid(theExport)) {
      setSaving(true);
      dispatch(saveExport(theExport, intl))
        .then(() => navigate('/exports'))
        .finally(() => setSaving(false));
    }
    setSaveClicked(true);
  };

  const onFieldChange = (
    field: keyof Export,
    value: string | boolean | ExportLineAssociation[],
  ) => {
    setTheExport({ ...theExport, [field]: value });
  };

  return (
    <Page
      backButtonTitle={formatMessage({ id: 'navBarExportsMenuItemLabel' })}
      title={formatMessage({ id: 'exportCreatorHeader' })}
    >
      <OverlayLoader
        isLoading={isSaving}
        text={formatMessage({ id: 'exportCreatorSavingOverlayLoaderText' })}
      >
        <Typography variant="subtitle1">
          {formatMessage({ id: 'exportCreatorDescription' })}
        </Typography>
        <RequiredInputMarker />
        <TextField
          sx={{ my: 3, maxWidth: '30rem' }}
          label={formatMessage({ id: 'exportCreatorNameFormLabel' })}
          variant="outlined"
          fullWidth
          {...getMuiErrorProps(
            formatMessage({ id: 'validateFormErrorExportNameIsEmpty' }),
            !isBlank(theExport.name),
            namePristine,
          )}
          defaultValue={theExport.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFieldChange('name', e.target.value)
          }
        />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4">
            {formatMessage({ id: 'exportCreatorLinesForExportHeader' })}
          </Typography>
          <LinesForExport
            onChange={(lines) => {
              onFieldChange('lineAssociations', lines);
            }}
          />
        </Box>
        <>
          {!hideExportDryRun && (
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="1"
                    checked={theExport.dryRun}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      onFieldChange('dryRun', e.target.checked)
                    }
                  />
                }
                label={formatMessage({ id: 'exportCreatorDryRunFormLabel' })}
              />
              <Tooltip
                placement="right"
                title={formatMessage({
                  id: 'exportCreatorDryRunFormLabelTooltip',
                })}
              >
                <Box component="span" sx={{ ml: 2, cursor: 'help' }}>
                  <HelpOutline />
                </Box>
              </Tooltip>
            </Box>
          )}
        </>
        <>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <FormControlLabel
              control={
                <Checkbox
                  value="1"
                  disabled={config.disableGenerateServiceLinksCheckbox}
                  checked={theExport.generateServiceLinks}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onFieldChange('generateServiceLinks', e.target.checked)
                  }
                />
              }
              label={formatMessage({
                id: 'exportCreatorGenerateServiceLinksFormLabel',
              })}
            />
            <Tooltip
              placement="right"
              title={formatMessage({
                id: 'exportCreatorGenerateServiceLinksFormLabelTooltip',
              })}
            >
              <Box component="span" sx={{ ml: 2, cursor: 'help' }}>
                <HelpOutline />
              </Box>
            </Tooltip>
          </Box>
        </>
        <>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <FormControlLabel
              control={
                <Checkbox
                  value="1"
                  disabled={config.disableIncludeDatedServiceJourneysCheckbox}
                  checked={theExport.includeDatedServiceJourneys}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(
                      'includeDatedServiceJourneys',
                      e.target.checked,
                    )
                  }
                />
              }
              label={formatMessage({
                id: 'exportCreatorIncludeDatedServiceJourneysFormLabel',
              })}
            />
            <Tooltip
              placement="right"
              title={formatMessage({
                id: 'exportCreatorIncludeDatedServiceJourneysFormLabelTooltip',
              })}
            >
              <Box component="span" sx={{ ml: 2, cursor: 'help' }}>
                <HelpOutline />
              </Box>
            </Tooltip>
          </Box>
        </>
        <Button
          variant="contained"
          color="success"
          sx={{ mt: 6 }}
          onClick={handleOnSaveClick}
        >
          {formatMessage({ id: 'exportCreatorSaveButtonLabelText' })}
        </Button>
      </OverlayLoader>
    </Page>
  );
};

export default ExportsCreator;
