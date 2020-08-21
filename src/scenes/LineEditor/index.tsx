import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIntl } from 'i18n';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import Page from 'components/Page';
import Line from 'model/Line';
import Loading from 'components/Loading';
import { Stepper } from '@entur/menu';
import EditorNavigationButtons from 'components/EditorNavigationButtons';
import { isBlank } from 'helpers/forms';
import { LINE_EDITOR_QUERY } from 'api/uttu/queries';
import { DELETE_LINE } from 'api/uttu/mutations';
import useUttuError from 'hooks/useUttuError';
import FlexibleLineEditor from 'scenes/FlexibleLines/scenes/Editor/FlexibleLineEditor';
import { Network } from 'model/Network';
import { GlobalState } from 'reducers';
import { filterNetexOperators } from 'reducers/organisations';
import { setSavedChanges } from 'actions/editor';

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

  const dispatch = useDispatch<any>();
  const { organisations } = useSelector<GlobalState, GlobalState>((s) => s);

  const { loading, error, data } = useQuery<LineData>(LINE_EDITOR_QUERY, {
    variables: { id: match?.params.id },
  });

  useEffect(() => {
    if (data?.line) {
      setLine({
        ...data.line,
        networkRef: data.line.network?.id,
      });
    }
  }, [data]);

  const [deleteLine] = useMutation(DELETE_LINE);

  useUttuError(
    'loadLineByIdErrorHeader',
    'loadLineByIdErrorMessage',
    error,
    () => history.push('/lines')
  );

  const onChange = (line: Line) => {
    setLine(line);
    dispatch(setSavedChanges(false));
  };

  const onDelete = useCallback(() => {
    deleteLine({
      variables: { id: match?.params?.id },
    });
    history.push('/lines');
  }, [match, deleteLine, history]);

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
            activeIndex={0}
            onStepClick={() => {}}
          />
          <FlexibleLineEditor
            isEdit={!isBlank(match?.params.id)}
            activeStep={0}
            setActiveStep={() => {}}
            flexibleLine={line!}
            changeFlexibleLine={onChange}
            operators={filterNetexOperators(organisations ?? [])}
            networks={data?.networks || []}
            spoilPristine={false}
            isSaving={false}
            isDeleting={false}
            isFlexibleLine={false}
            steps={FIXED_LINE_STEPS}
          />
          <EditorNavigationButtons
            editMode={!isBlank(match?.params.id)}
            firstStep={true}
            lastStep={false}
            onDelete={onDelete}
            onSave={() => {}}
            onNext={() => {}}
            onCancel={() => {}}
            onPrevious={
              () => {}
              //setActiveStepperIndex(Math.max(activeStepperIndex - 1, 0))
            }
          />
        </>
      </Loading>
    </Page>
  );
};
