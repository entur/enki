import { useState, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { PrimaryButton, SecondaryButton } from '@entur/button';
import { Dropdown, NormalizedDropdownItemType } from '@entur/dropdown';
import { TextField, Checkbox } from '@entur/form';
import { Heading1, Paragraph } from '@entur/typography';

import Loading from 'components/Loading';
import OverlayLoader from 'components/OverlayLoader';
import Page from 'components/Page';
import { useAppSelector } from '../../../store/hooks';

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
  const dispatch = useDispatch<any>();

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

  // Manual data fetching states
  const [lines, setLines] = useState<Line[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [linesLoading, setLinesLoading] = useState<boolean>(false);
  const [networksLoading, setNetworksLoading] = useState<boolean>(false);
  const [linesError, setLinesError] = useState<string | null>(null);
  const [migrating, setMigrating] = useState<boolean>(false);

  // Get providers from Redux state and config
  const providersState = useAppSelector((state) => state.providers);
  const allProviders = providersState?.providers || [];
  const config = useAppSelector((state) => state.config);
  const auth = useAppSelector((state) => state.auth);

  // Load lines for the source provider
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

  // Load networks for target provider
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

  // Load providers using Redux action
  useEffect(() => {
    dispatch(getProviders());
  }, [dispatch]);

  // Load lines when provider changes
  useEffect(() => {
    loadLines();
  }, [loadLines]);

  // Load networks when target provider changes
  useEffect(() => {
    if (targetProviderId) {
      loadNetworks();
    } else {
      setNetworks([]);
    }
  }, [targetProviderId, loadNetworks]);

  // Get current provider info
  const currentProvider = allProviders.find(
    (provider) => provider.code === providerId,
  );

  // Filter out current provider from target options
  const availableProviders = allProviders.filter(
    (provider) => provider.code !== providerId,
  );

  // Reset network selection when target provider changes
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
        'providers', // Use providers endpoint for admin mutations
        migrateLineMutation,
        { input },
        await auth.getAccessToken(),
      );

      setMigrationResult(result.migrateLine);
    } catch (error) {
      console.error('Migration failed:', error);
      // You might want to show a notification here
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
        <Paragraph>Error loading data. Please try again.</Paragraph>
      </Page>
    );
  }

  return (
    <Page
      backButtonTitle={formatMessage({ id: 'navBarProvidersMenuItemLabel' })}
      title="Line Migration"
    >
      <div className="line-migration">
        <Heading1>Migrate Line from {currentProvider?.name}</Heading1>
        <Paragraph>
          Select a line from {currentProvider?.name} ({currentProvider?.code})
          and migrate it to another provider. All related entities will be
          copied and assigned new IDs in the target provider's codespace.
        </Paragraph>

        <OverlayLoader isLoading={migrating} text="Migrating line...">
          <div className="migration-form">
            {/* Source Line Selection */}
            <div className="form-section">
              <Dropdown
                className="form-section"
                label="Source Line"
                selectedItem={getInit(
                  lines.map((line) => ({
                    id: line.id,
                    name:
                      line.publicCode || line.privateCode
                        ? `${line.name} (${line.publicCode || line.privateCode})`
                        : line.name,
                  })),
                  selectedLineId,
                )}
                items={() =>
                  mapToItems(
                    lines.map((line) => ({
                      id: line.id,
                      name:
                        line.publicCode || line.privateCode
                          ? `${line.name} (${line.publicCode || line.privateCode})`
                          : line.name,
                    })),
                  )
                }
                placeholder="Select a line to migrate"
                clearable
                labelClearSelectedItem="Clear selection"
                noMatchesText="No lines found"
                onChange={(item) => setSelectedLineId(item?.value ?? '')}
                disabled={linesLoading}
              />
            </div>

            {/* Target Provider Selection */}
            <div className="form-section">
              <Dropdown
                className="form-section"
                label="Target Provider"
                selectedItem={getInit(
                  availableProviders.map((provider) => ({
                    id: provider.code,
                    name: `${provider.name} (${provider.code})`,
                  })),
                  targetProviderId,
                )}
                items={() =>
                  mapToItems(
                    availableProviders.map((provider) => ({
                      id: provider.code,
                      name: `${provider.name} (${provider.code})`,
                    })),
                  )
                }
                placeholder="Select target provider"
                clearable
                labelClearSelectedItem="Clear selection"
                noMatchesText="No providers found"
                onChange={(item) => setTargetProviderId(item?.value ?? '')}
                disabled={!allProviders.length}
              />
            </div>

            {/* Target Network Selection */}
            <div className="form-section">
              <Dropdown
                className="form-section"
                label="Target Network"
                selectedItem={getInit(
                  networks.map((network) => ({
                    id: network.id,
                    name: network.privateCode
                      ? `${network.name} (${network.privateCode})`
                      : network.name,
                  })),
                  targetNetworkId,
                )}
                items={() =>
                  mapToItems(
                    networks.map((network) => ({
                      id: network.id,
                      name: network.privateCode
                        ? `${network.name} (${network.privateCode})`
                        : network.name,
                    })),
                  )
                }
                placeholder="Select target network"
                clearable
                labelClearSelectedItem="Clear selection"
                noMatchesText="No networks found"
                onChange={(item) => setTargetNetworkId(item?.value ?? '')}
                disabled={!targetProviderId || networksLoading}
              />
              {targetProviderId &&
                !networksLoading &&
                networks.length === 0 && (
                  <Paragraph>
                    No networks found for the selected provider.
                  </Paragraph>
                )}
            </div>

            {/* Migration Options */}
            <div className="form-section">
              <Dropdown
                className="form-section"
                label="Conflict Resolution Strategy"
                selectedItem={getInit(
                  [
                    { id: 'RENAME', name: 'Rename conflicting entities' },
                    { id: 'FAIL', name: 'Fail on conflicts' },
                    { id: 'SKIP', name: 'Skip conflicting entities' },
                  ],
                  conflictResolution,
                )}
                items={() =>
                  mapToItems([
                    { id: 'RENAME', name: 'Rename conflicting entities' },
                    { id: 'FAIL', name: 'Fail on conflicts' },
                    { id: 'SKIP', name: 'Skip conflicting entities' },
                  ])
                }
                placeholder="Select conflict resolution strategy"
                clearable={false}
                noMatchesText="No options found"
                onChange={(item) =>
                  setConflictResolution(
                    (item?.value ?? 'RENAME') as 'FAIL' | 'RENAME' | 'SKIP',
                  )
                }
              />
            </div>

            <div className="form-section">
              <Checkbox
                checked={includeDayTypes}
                onChange={(e) => setIncludeDayTypes(e.target.checked)}
              >
                Include Day Types in migration
              </Checkbox>
            </div>

            <div className="form-section">
              <Checkbox
                checked={dryRun}
                onChange={(e) => setDryRun(e.target.checked)}
              >
                Dry run (preview only)
              </Checkbox>
            </div>

            {/* Action Buttons */}
            <div className="buttons">
              <SecondaryButton onClick={() => navigate('/providers')}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                disabled={!isFormValid || migrating}
                onClick={handleMigration}
              >
                {dryRun ? 'Preview Migration' : 'Migrate Line'}
              </PrimaryButton>
            </div>
          </div>
        </OverlayLoader>

        {/* Migration Result */}
        {migrationResult && (
          <div className="migration-result">
            <Heading1>Migration Result</Heading1>
            {migrationResult.success ? (
              <div>
                <Paragraph>Migration completed successfully!</Paragraph>
                {migrationResult.migratedLineId && (
                  <Paragraph>
                    New line ID: {migrationResult.migratedLineId}
                  </Paragraph>
                )}
                {migrationResult.summary && (
                  <div>
                    <Paragraph>
                      Entities migrated:{' '}
                      {migrationResult.summary.entitiesMigrated}
                    </Paragraph>
                    <Paragraph>
                      Warnings: {migrationResult.summary.warningsCount}
                    </Paragraph>
                    <Paragraph>
                      Execution time: {migrationResult.summary.executionTimeMs}
                      ms
                    </Paragraph>
                  </div>
                )}
              </div>
            ) : (
              <Paragraph>
                Migration failed. Please check the warnings below.
              </Paragraph>
            )}

            {migrationResult.warnings &&
              migrationResult.warnings.length > 0 && (
                <div>
                  <Heading1>Warnings</Heading1>
                  {migrationResult.warnings.map((warning, index) => (
                    <Paragraph key={index}>
                      {warning.type}: {warning.message}
                      {warning.entityId && ` (Entity: ${warning.entityId})`}
                    </Paragraph>
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
