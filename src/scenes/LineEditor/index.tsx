import { useMutation } from '@apollo/client';
import { setSavedChanges } from 'actions/editor';
import { showSuccessNotification } from 'actions/notification';
import { DELETE_LINE, MUTATE_LINE } from 'api/uttu/mutations';
import LineEditorStepper from 'components/LineEditorStepper';
import Loading from 'components/Loading';
import Page from 'components/Page';
import { isBlank } from 'helpers/forms';
import {
  currentStepIsValid,
  getMaxAllowedStepIndex,
  validLine,
} from 'helpers/validation';
import Line, { lineToPayload } from 'model/Line';
import { filterAuthorities, filterNetexOperators } from 'model/Organisation';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Navigate, useMatch, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import LineEditorSteps from './LineEditorSteps';
import { FIXED_LINE_STEPS } from './constants';
import { useLine, useUttuErrors } from './hooks';
import './styles.scss';

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
  const organisations = useAppSelector((state) => state.organisations);
  const editor = useAppSelector((state) => state.editor);

  const {
    line,
    setLine,
    refetchLine,
    loading,
    error,
    networks,
    brandings,
    notFound,
  } = useLine();

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
          false,
        ),
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
        formatMessage({ id: 'deleteLineSuccessMessage' }),
      ),
    );
    navigate('/lines');

    // eslint-disable-next-line
  }, [match]);

  const onBackButtonClicked = () =>
    editor.isSaved ? navigate('/lines') : setShowConfirm(true);

  const authoritiesMissing =
    organisations && filterAuthorities(organisations).length === 0;

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
                operators={filterNetexOperators(organisations ?? [])}
                networks={networks || []}
                brandings={brandings || []}
                spoilPristine={nextClicked}
              />
            )}
          </LineEditorStepper>
        </Loading>
      </>
    </Page>
  );
};
