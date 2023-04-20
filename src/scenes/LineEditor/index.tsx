import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { Navigate, useMatch, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Page from 'components/Page';
import Line from 'model/Line';
import Loading from 'components/Loading';
import { isBlank } from 'helpers/forms';
import { DELETE_LINE, MUTATE_LINE } from 'api/uttu/mutations';
import { GlobalState } from 'reducers';
import { filterNetexOperators, filterAuthorities } from 'model/Organisation';
import { setSavedChanges } from 'actions/editor';
import {
  validLine,
  currentStepIsValid,
  getMaxAllowedStepIndex,
} from 'helpers/validation';
import { lineToPayload } from 'model/Line';
import { showSuccessNotification } from 'actions/notification';
import { useUttuErrors, useLine } from './hooks';
import LineEditorStepper from 'components/LineEditorStepper';
import { FIXED_LINE_STEPS } from './constants';
import LineEditorSteps from './LineEditorSteps';
import './styles.scss';
import { useConfig } from 'config/ConfigContext';

export default () => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const navigate = useNavigate();
  const match = useMatch('/lines/edit/:id');
  const [nextClicked, setNextClicked] = useState<boolean>(false);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const dispatch = useDispatch<any>();
  const { organisations, editor, providers } = useSelector<
    GlobalState,
    GlobalState
  >((s) => s);

  const { line, setLine, refetchLine, loading, error, networks, notFound } =
    useLine();

  const [deleteLine, { error: deleteError }] = useMutation(DELETE_LINE);
  const [mutateLine, { error: mutationError }] = useMutation(MUTATE_LINE);

  useUttuErrors(error, deleteError, mutationError);

  const onChange = (changeLine: Line) => {
    setLine(changeLine);
    dispatch(setSavedChanges(false));
  };

  const onSave = useCallback(async () => {
    setNextClicked(true);
    setSaving(true);

    try {
      await mutateLine({
        variables: { input: lineToPayload(line!) },
      });

      await refetchLine();

      // TODO: can this be handled by local state?
      dispatch(setSavedChanges(true));

      dispatch(
        showSuccessNotification(
          formatMessage({ id: 'saveLineSuccessHeader' }),
          formatMessage({ id: 'saveLineSuccessMessage' }),
          false
        )
      );
      if (isBlank(match?.params.id)) {
        navigate('/lines');
      }
    } catch (e) {
      // noop just catching to avoid unhandled rejection
      // error message is handled upstream
      console.error(e);
    } finally {
      setSaving(false);
    }
    setNextClicked(false);

    // eslint-disable-next-line
  }, [line]);

  const onDelete = useCallback(async () => {
    setDeleting(true);
    await deleteLine({
      variables: { id: match?.params?.id },
    });
    dispatch(
      showSuccessNotification(
        formatMessage({ id: 'deleteLineSuccessHeader' }),
        formatMessage({ id: 'deleteLineSuccessMessage' })
      )
    );
    navigate('/lines');

    // eslint-disable-next-line
  }, [match]);

  const onBackButtonClicked = () =>
    editor.isSaved ? navigate('/lines') : setShowConfirm(true);

  const config = useConfig();

  const authoritiesMissing =
    organisations &&
    filterAuthorities(
      organisations,
      providers.active,
      config.enableLegacyOrganisationsFilter
    ).length === 0;

  return (
    <Page
      backButtonTitle={formatMessage({ id: 'navBarLinesMenuItemLabel' })}
      onBackButtonClick={onBackButtonClicked}
    >
      <>
        {notFound && <Navigate to="/lines" replace />}
        <Loading
          isLoading={loading || !line}
          text={formatMessage({ id: 'editorLoadingLineText' })}
        >
          <LineEditorStepper
            steps={FIXED_LINE_STEPS.map((step) => formatMessage({ id: step }))}
            isValidStepIndex={(i: number) =>
              getMaxAllowedStepIndex(line!, intl) >= i
            }
            currentStepIsValid={(i) => currentStepIsValid(i, line!, intl)}
            isLineValid={line ? validLine(line, intl) : false}
            setNextClicked={setNextClicked}
            isEdit={!isBlank(match?.params.id)}
            spoilPristine={nextClicked}
            onDelete={onDelete}
            isDeleting={isDeleting}
            onSave={onSave}
            isSaving={isSaving}
            isSaved={editor.isSaved}
            redirectTo="/lines"
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            authoritiesMissing={authoritiesMissing}
          >
            {(activeStep) => (
              <LineEditorSteps
                activeStep={activeStep}
                line={line!}
                changeLine={onChange}
                operators={filterNetexOperators(
                  organisations ?? [],
                  config.enableLegacyOrganisationsFilter
                )}
                networks={networks || []}
                spoilPristine={nextClicked}
              />
            )}
          </LineEditorStepper>
        </Loading>
      </>
    </Page>
  );
};
