import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIntl } from 'i18n';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import Page from 'components/Page';
import Line, { initLine } from 'model/Line';
import Loading from 'components/Loading';
import { Stepper } from '@entur/menu';
import EditorNavigationButtons from 'components/EditorNavigationButtons';
import { isBlank } from 'helpers/forms';
import { LINE_EDITOR_QUERY } from 'api/uttu/queries';
import { DELETE_LINE, MUTATE_LINE } from 'api/uttu/mutations';
import useUttuError from 'hooks/useUttuError';
import FlexibleLineEditor from 'scenes/FlexibleLines/scenes/Editor/FlexibleLineEditor';
import { Network } from 'model/Network';
import { GlobalState } from 'reducers';
import { filterNetexOperators } from 'reducers/organisations';
import { setSavedChanges } from 'actions/editor';
import { validLine, currentStepIsValid } from './validateForm';
import { lineToPayload } from 'model/Line';
import { showSuccessNotification } from 'actions/notification';
import { getMaxAllowedStepIndex } from 'scenes/FlexibleLines/scenes/Editor/validateForm';

enum LINE_STEP {
  ABOUT = 'stepperAbout',
  JOURNEYPATTERN = 'stepperJourneyPattern',
  SERVICEJOURNEY = 'stepperServiceJourney',
}

const FIXED_LINE_STEPS: LINE_STEP[] = [
  LINE_STEP.ABOUT,
  LINE_STEP.JOURNEYPATTERN,
  LINE_STEP.SERVICEJOURNEY,
];

interface LineData {
  line: Line;
  networks: Network[];
}

interface MatchParams {
  id: string;
}

export default () => {
  const { formatMessage } = useSelector(selectIntl);
  const history = useHistory();
  const match = useRouteMatch<MatchParams>('/lines/edit/:id');

  const [line, setLine] = useState<Line>();
  //const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [nextClicked, setNextClicked] = useState<boolean>(false);
  const [isSaving, setSaving] = useState(false);
  const [
    isDeleting,
    //setDeleting
  ] = useState(false);

  const [activeStepperIndex, setActiveStepperIndex] = useState(0);

  const dispatch = useDispatch<any>();
  const { organisations } = useSelector<GlobalState, GlobalState>((s) => s);

  const { loading, error, data } = useQuery<LineData>(LINE_EDITOR_QUERY, {
    variables: {
      id: match?.params.id || '',
      includeLine: !isBlank(match?.params.id),
    },
  });

  useEffect(() => {
    if (data?.line) {
      setLine({
        ...data.line,
        networkRef: data.line.network?.id,
      });
    }
  }, [data]);

  useEffect(() => {
    if (isBlank(match?.params.id)) {
      setLine(initLine());
    }
  }, [match]);

  const [deleteLine, { error: deleteError }] = useMutation(DELETE_LINE);
  const [mutateLine, { error: mutationError }] = useMutation(MUTATE_LINE);

  useUttuError(
    'loadLineByIdErrorHeader',
    'loadLineByIdErrorMessage',
    error,
    () => history.push('/lines')
  );

  useUttuError(
    'flexibleLinesDeleteLineErrorHeader',
    'flexibleLinesDeleteLineErrorMessage',
    deleteError
  );

  useUttuError(
    'flexibleLinesSaveLineErrorHeader',
    'flexibleLinesSaveLineErrorMessage',
    mutationError
  );

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
        dispatch(setSavedChanges(true));

        dispatch(
          showSuccessNotification(
            formatMessage('flexibleLinesSaveLineSuccessHeader'),
            formatMessage('flexibleLinesSaveLineSuccessMessage'),
            false
          )
        );
        //!isEdit && goToLines()
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
    await deleteLine({
      variables: { id: match?.params?.id },
    });
    dispatch(
      showSuccessNotification(
        formatMessage('flexibleLinesDeleteLineSuccessHeader'),
        formatMessage('flexibleLinesDeleteLineSuccessMessage')
      )
    );
    history.push('/lines');

    // eslint-disable-next-line
  }, [match]);

  const onNextClicked = () => {
    if (currentStepIsValid(activeStepperIndex, line!)) {
      setActiveStepperIndex(activeStepperIndex + 1);
      setNextClicked(false);
    } else {
      setNextClicked(true);
    }
  };

  const onBackButtonClicked = () => {};
  //editor.isSaved ? goToLines() : setShowConfirm(true);

  const onStepClicked = (stepIndexClicked: number) => {
    if (getMaxAllowedStepIndex(line!, false) >= stepIndexClicked) {
      setActiveStepperIndex(stepIndexClicked);
    }
  };

  return (
    <Page
      backButtonTitle={formatMessage('navBarLinesMenuItemLabel')}
      onBackButtonClick={() => history.push('/lines')}
    >
      <Loading
        isLoading={loading || !line}
        text={formatMessage('editorLoadingLineText')}
      >
        <>
          <Stepper
            steps={FIXED_LINE_STEPS.map((step) => formatMessage(step))}
            activeIndex={activeStepperIndex}
            onStepClick={(index) => onStepClicked(index)}
          />
          <FlexibleLineEditor
            isEdit={!isBlank(match?.params.id)}
            activeStep={activeStepperIndex}
            setActiveStep={setActiveStepperIndex}
            flexibleLine={line!}
            changeFlexibleLine={onChange}
            operators={filterNetexOperators(organisations ?? [])}
            networks={data?.networks || []}
            spoilPristine={nextClicked}
            isSaving={isSaving}
            isDeleting={isDeleting}
            isFlexibleLine={false}
            steps={FIXED_LINE_STEPS}
          />
          <EditorNavigationButtons
            editMode={!isBlank(match?.params.id)}
            firstStep={activeStepperIndex === 0}
            lastStep={activeStepperIndex === FIXED_LINE_STEPS.length - 1}
            onDelete={onDelete}
            onSave={onSave}
            onNext={onNextClicked}
            onCancel={onBackButtonClicked}
            onPrevious={() => {
              setActiveStepperIndex(Math.max(activeStepperIndex - 1, 0));
            }}
          />
        </>
      </Loading>
    </Page>
  );
};
