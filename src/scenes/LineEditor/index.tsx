import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIntl } from 'i18n';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Page from 'components/Page';
import Line from 'model/Line';
import Loading from 'components/Loading';
import { isBlank } from 'helpers/forms';
import { DELETE_LINE, MUTATE_LINE } from 'api/uttu/mutations';
import FlexibleLineEditor from 'scenes/FlexibleLines/scenes/Editor/FlexibleLineEditor';
import { GlobalState } from 'reducers';
import { filterNetexOperators } from 'reducers/organisations';
import { setSavedChanges } from 'actions/editor';
import { validLine, currentStepIsValid } from './validateForm';
import { lineToPayload } from 'model/Line';
import { showSuccessNotification } from 'actions/notification';
import { getMaxAllowedStepIndex } from 'scenes/FlexibleLines/scenes/Editor/validateForm';
import { useUttuErrors, useLine } from './hooks';
import Stepper from './Stepper';
import { FIXED_LINE_STEPS } from './constants';

interface MatchParams {
  id: string;
}

export default () => {
  const { formatMessage } = useSelector(selectIntl);
  const history = useHistory();
  const match = useRouteMatch<MatchParams>('/lines/edit/:id');
  const [nextClicked, setNextClicked] = useState<boolean>(false);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const dispatch = useDispatch<any>();
  const { organisations, editor } = useSelector<GlobalState, GlobalState>(
    (s) => s
  );

  const { line, setLine, loading, error, networks } = useLine();

  const [deleteLine, { error: deleteError }] = useMutation(DELETE_LINE);
  const [mutateLine, { error: mutationError }] = useMutation(MUTATE_LINE);

  useUttuErrors(error, deleteError, mutationError);

  const onChange = (changeLine: Line) => {
    setLine(changeLine);
    dispatch(setSavedChanges(false));
  };

  const onSave = useCallback(async () => {
    if (validLine(line!)) {
      setNextClicked(true);
      setSaving(true);

      try {
        await mutateLine({
          variables: { input: lineToPayload(line!) },
        });

        // TODO: can this be handled by local state?
        dispatch(setSavedChanges(true));

        dispatch(
          showSuccessNotification(
            formatMessage('saveLineSuccessHeader'),
            formatMessage('saveLineSuccessMessage'),
            false
          )
        );
        if (isBlank(match?.params.id)) {
          history.push('/lines');
        }
      } catch (_) {
        // noop just catching to avoid unhandled rejection
        // error message is handled upstream
      } finally {
        setSaving(false);
      }
      setNextClicked(false);
    }

    // eslint-disable-next-line
  }, [line]);

  const onDelete = useCallback(async () => {
    setDeleting(true);
    await deleteLine({
      variables: { id: match?.params?.id },
    });
    dispatch(
      showSuccessNotification(
        formatMessage('deleteLineSuccessHeader'),
        formatMessage('deleteLineSuccessMessage')
      )
    );
    history.push('/lines');

    // eslint-disable-next-line
  }, [match]);

  return (
    <Page
      backButtonTitle={formatMessage('navBarLinesMenuItemLabel')}
      onBackButtonClick={() => history.push('/lines')}
    >
      <Loading
        isLoading={loading || !line}
        text={formatMessage('editorLoadingLineText')}
      >
        <Stepper
          steps={FIXED_LINE_STEPS.map((step) => formatMessage(step))}
          isValidStepIndex={(i: number) =>
            getMaxAllowedStepIndex(line!, false) >= i
          }
          currentStepIsValid={(i) => currentStepIsValid(i, line!)}
          setNextClicked={setNextClicked}
          isEdit={!isBlank(match?.params.id)}
          onDelete={onDelete}
          onSave={onSave}
          isSaved={editor.isSaved}
          redirect={() => {
            history.push('/lines');
          }}
          redirectTo="/lines"
        >
          {(activeStepperIndex) => (
            <FlexibleLineEditor
              isEdit={!isBlank(match?.params.id)}
              activeStep={activeStepperIndex}
              flexibleLine={line!}
              changeFlexibleLine={onChange}
              operators={filterNetexOperators(organisations ?? [])}
              networks={networks || []}
              spoilPristine={nextClicked}
              isSaving={isSaving}
              isDeleting={isDeleting}
              isFlexibleLine={false}
              steps={FIXED_LINE_STEPS}
            />
          )}
        </Stepper>
      </Loading>
    </Page>
  );
};
