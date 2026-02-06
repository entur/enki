import { useState, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';

import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

import { getNetworksQuery } from 'api/uttu/queries';
import { UttuQuery } from 'api';
import Line from 'model/Line';
import { Network } from 'model/Network';
import Provider from 'model/Provider';
import { mapToItems, getInit } from 'helpers/dropdown';
import { getProviders } from '../../../actions/providers';
import './styles.scss';

// String version of the lines query for UttuQuery
const getLinesQuery = `
  query GetLines {
    lines {
      id
      name
      privateCode
      publicCode
      operatorRef
    }
  }
`;

// String version of the migration mutation for UttuQuery (providers endpoint)
const migrateLineMutation = `
  mutation MigrateLine($input: LineMigrationInput!) {
    migrateLine(input: $input) {
      success
      migratedLineId
      summary {
        entitiesMigrated
        warningsCount
        executionTimeMs
      }
      warnings {
        type
        message
        entityId
      }
    }
  }
`;

interface LineMigrationInput {
  sourceLineId: string;
  targetProviderId: string;
  targetNetworkId: string;
  options?: {
    conflictResolution?: 'FAIL' | 'RENAME' | 'SKIP';
    includeDayTypes?: boolean;
    dryRun?: boolean;
  };
}

interface LineMigrationResult {
  success: boolean;
  migratedLineId?: string;
  summary?: {
    entitiesMigrated: number;
    warningsCount: number;
    executionTimeMs: number;
  };
  warnings?: Array<{
    type: string;
    message: string;
    entityId?: string;
  }>;
}

const LineMigration = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { providerId } = useParams<{ providerId: string }>();
  const dispatch = useAppDispatch();

  const [selectedLineId, setSelectedLineId] = useState<string>('');
  const [targetProviderId, setTargetProviderId] = useState<string>('');
  const [targetNetworkId, setTargetNetworkId] = useState<string>('');
  const [conflictResolution, setConflictResolution] = useState<
    'FAIL' | 'RENAME' | 'SKIP'
  >('RENAME');
  const [includeDayTypes, setIncludeDayTypes] = useState<boolean>(true);
  const [dryRun, setDryRun] = useState<boolean>(false);
  const [migrationResult, setMigrationResult] =
    useState<LineMigrationResult | null>(null);

  const [lines, setLines] = useState<Line[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [linesLoading, setLinesLoading] = useState<boolean>(false);
  const [networksLoading, setNetworksLoading] = useState<boolean>(false);
  const [linesError, setLinesError] = useState<string | null>(null);
  const [migrating, setMigrating] = useState<boolean>(false);

  const providersState = useAppSelector((state) => state.providers);
  const allProviders = providersState?.providers || [];
  const config = useAppSelector((state) => state.config);
  const auth = useAppSelector((state) => state.auth);

  const loadLines = useCallback(async () => {
    if (!providerId || !config.uttuApiUrl) return;

    setLinesLoading(true);
    setLinesError(null);

    try {
      const data = await UttuQuery(
        config.uttuApiUrl,
        providerId,
        getLinesQuery,
        {},
        await auth.getAccessToken(),
      );
      setLines(data.lines || []);
    } catch (error) {
      setLinesError('Failed to load lines');
      setLines([]);
    } finally {
      setLinesLoading(false);
    }
  }, [providerId, config.uttuApiUrl, auth]);

  const loadNetworks = useCallback(async () => {
    if (!targetProviderId || !config.uttuApiUrl) return;

    setNetworksLoading(true);

    try {
      const data = await UttuQuery(
        config.uttuApiUrl,
        targetProviderId,
        getNetworksQuery,
        {},
        await auth.getAccessToken(),
      );
      setNetworks(data.networks || []);
    } catch (error) {
      setNetworks([]);
    } finally {
      setNetworksLoading(false);
    }
  }, [targetProviderId, config.uttuApiUrl, auth]);

  useEffect(() => {
    dispatch(getProviders());
  }, [dispatch]);

  useEffect(() => {
    loadLines();
  }, [loadLines]);

  useEffect(() => {
    if (targetProviderId) {
      loadNetworks();
    } else {
      setNetworks([]);
    }
  }, [targetProviderId, loadNetworks]);

  const currentProvider = allProviders.find(
    (provider) => provider.code === providerId,
  );

  const availableProviders = allProviders.filter(
    (provider) => provider.code !== providerId,
  );

  useEffect(() => {
    setTargetNetworkId('');
  }, [targetProviderId]);

  const handleMigration = useCallback(async () => {
    if (
      !selectedLineId ||
      !targetProviderId ||
      !targetNetworkId ||
      !config.uttuApiUrl
    ) {
      return;
    }

    setMigrating(true);

    try {
      const input: LineMigrationInput = {
        sourceLineId: selectedLineId,
        targetProviderId,
        targetNetworkId,
        options: {
          conflictResolution,
          includeDayTypes,
          dryRun,
        },
      };

      const result = await UttuQuery(
        config.uttuApiUrl,
        'providers',
        migrateLineMutation,
        { input },
        await auth.getAccessToken(),
      );

      setMigrationResult(result.migrateLine);
    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationResult({
        success: false,
        warnings: [
          { type: 'ERROR', message: 'Migration failed. Please try again.' },
        ],
      });
    } finally {
      setMigrating(false);
    }
  }, [
    selectedLineId,
    targetProviderId,
    targetNetworkId,
    conflictResolution,
    includeDayTypes,
    dryRun,
    config.uttuApiUrl,
    auth,
  ]);

  const isFormValid = selectedLineId && targetProviderId && targetNetworkId;

  if (linesError) {
    return (
      <Page
        backButtonTitle={formatMessage({ id: 'navBarProvidersMenuItemLabel' })}
        title="Line Migration"
      >
        <Typography variant="body1">
          Error loading data. Please try again.
        </Typography>
      </Page>
    );
  }

  return (
    <Page
      backButtonTitle={formatMessage({ id: 'navBarProvidersMenuItemLabel' })}
      title="Line Migration"
    >
      <div className="line-migration">
        <Typography variant="h1">
          Migrate Line from {currentProvider?.name}
        </Typography>
        <Typography variant="body1">
          Select a line from {currentProvider?.name} ({currentProvider?.code})
          and migrate it to another provider. All related entities will be
          copied and assigned new IDs in the target provider's codespace.
        </Typography>

        <OverlayLoader isLoading={migrating} text="Migrating line...">
          <div className="migration-form">
            <div className="form-section">
              <Autocomplete
                className="form-section"
                value={getInit(
                  lines.map((line) => ({
                    id: line.id,
                    name:
                      line.publicCode || line.privateCode
                        ? `${line.name} (${line.publicCode || line.privateCode})`
                        : line.name,
                  })),
                  selectedLineId,
                )}
                onChange={(_event, newValue) =>
                  setSelectedLineId(newValue?.value ?? '')
                }
                options={mapToItems(
                  lines.map((line) => ({
                    id: line.id,
                    name:
                      line.publicCode || line.privateCode
                        ? `${line.name} (${line.publicCode || line.privateCode})`
                        : line.name,
                  })),
                )}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                noOptionsText="No lines found"
                disabled={linesLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Source Line"
                    placeholder="Select a line to migrate"
                  />
                )}
              />
            </div>

            <div className="form-section">
              <Autocomplete
                className="form-section"
                value={getInit(
                  availableProviders.map((provider) => ({
                    id: provider.code,
                    name: `${provider.name} (${provider.code})`,
                  })),
                  targetProviderId,
                )}
                onChange={(_event, newValue) =>
                  setTargetProviderId(newValue?.value ?? '')
                }
                options={mapToItems(
                  availableProviders.map((provider) => ({
                    id: provider.code,
                    name: `${provider.name} (${provider.code})`,
                  })),
                )}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                noOptionsText="No providers found"
                disabled={!allProviders.length}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Target Provider"
                    placeholder="Select target provider"
                  />
                )}
              />
            </div>

            <div className="form-section">
              <Autocomplete
                className="form-section"
                value={getInit(
                  networks.map((network) => ({
                    id: network.id,
                    name: network.privateCode
                      ? `${network.name} (${network.privateCode})`
                      : network.name,
                  })),
                  targetNetworkId,
                )}
                onChange={(_event, newValue) =>
                  setTargetNetworkId(newValue?.value ?? '')
                }
                options={mapToItems(
                  networks.map((network) => ({
                    id: network.id,
                    name: network.privateCode
                      ? `${network.name} (${network.privateCode})`
                      : network.name,
                  })),
                )}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                noOptionsText="No networks found"
                disabled={!targetProviderId || networksLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Target Network"
                    placeholder="Select target network"
                  />
                )}
              />
              {targetProviderId &&
                !networksLoading &&
                networks.length === 0 && (
                  <Typography variant="body1">
                    No networks found for the selected provider.
                  </Typography>
                )}
            </div>

            <div className="form-section">
              <Autocomplete
                className="form-section"
                disableClearable
                value={
                  getInit(
                    [
                      { id: 'RENAME', name: 'Rename conflicting entities' },
                      { id: 'FAIL', name: 'Fail on conflicts' },
                      { id: 'SKIP', name: 'Skip conflicting entities' },
                    ],
                    conflictResolution,
                  )!
                }
                onChange={(_event, newValue) =>
                  setConflictResolution(
                    (newValue?.value ?? 'RENAME') as 'FAIL' | 'RENAME' | 'SKIP',
                  )
                }
                options={mapToItems([
                  { id: 'RENAME', name: 'Rename conflicting entities' },
                  { id: 'FAIL', name: 'Fail on conflicts' },
                  { id: 'SKIP', name: 'Skip conflicting entities' },
                ])}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                noOptionsText="No options found"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Conflict Resolution Strategy"
                    placeholder="Select conflict resolution strategy"
                  />
                )}
              />
            </div>

            <div className="form-section">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeDayTypes}
                    onChange={(e) => setIncludeDayTypes(e.target.checked)}
                  />
                }
                label="Include Day Types in migration"
              />
            </div>

            <div className="form-section">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dryRun}
                    onChange={(e) => setDryRun(e.target.checked)}
                  />
                }
                label="Dry run (preview only)"
              />
            </div>

            <div className="buttons">
              <Button variant="outlined" onClick={() => navigate('/providers')}>
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={!isFormValid || migrating}
                onClick={handleMigration}
              >
                {dryRun ? 'Preview Migration' : 'Migrate Line'}
              </Button>
            </div>
          </div>
        </OverlayLoader>

        {migrationResult && (
          <div className="migration-result">
            <Typography variant="h1">Migration Result</Typography>
            {migrationResult.success ? (
              <div>
                <Typography variant="body1">
                  Migration completed successfully!
                </Typography>
                {migrationResult.migratedLineId && (
                  <Typography variant="body1">
                    New line ID: {migrationResult.migratedLineId}
                  </Typography>
                )}
                {migrationResult.summary && (
                  <div>
                    <Typography variant="body1">
                      Entities migrated:{' '}
                      {migrationResult.summary.entitiesMigrated}
                    </Typography>
                    <Typography variant="body1">
                      Warnings: {migrationResult.summary.warningsCount}
                    </Typography>
                    <Typography variant="body1">
                      Execution time: {migrationResult.summary.executionTimeMs}
                      ms
                    </Typography>
                  </div>
                )}
              </div>
            ) : (
              <Typography variant="body1">
                Migration failed. Please check the warnings below.
              </Typography>
            )}

            {migrationResult.warnings &&
              migrationResult.warnings.length > 0 && (
                <div>
                  <Typography variant="h1">Warnings</Typography>
                  {migrationResult.warnings.map((warning, index) => (
                    <Typography variant="body1" key={index}>
                      {warning.type}: {warning.message}
                      {warning.entityId && ` (Entity: ${warning.entityId})`}
                    </Typography>
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    </Page>
  );
};

export default LineMigration;
