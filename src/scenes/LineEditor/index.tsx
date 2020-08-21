import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
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
import useRefetchOnLocationChange from 'hooks/useRefetchOnLocationChange';
import useUttuError from 'hooks/useUttuError';
import FlexibleLineEditor from 'scenes/FlexibleLines/scenes/Editor/FlexibleLineEditor';
import { Network } from 'model/Network';
import { GlobalState } from 'reducers';
import { filterNetexOperators } from 'reducers/organisations';

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

  const { organisations, editor, providers } = useSelector<
    GlobalState,
    GlobalState
  >((s) => s);

  const { loading, error, data, refetch } = useQuery<LineData>(
    LINE_EDITOR_QUERY,
    {
      variables: { id: match?.params.id },
    }
  );

  const [deleteLine] = useMutation(DELETE_LINE);

  useUttuError(
    'loadLineByIdErrorHeader',
    'loadLineByIdErrorMessage',
    error,
    () => history.push('/lines')
  );

  useRefetchOnLocationChange(refetch);

  const onDelete = useCallback(() => {
    deleteLine({
      variables: { id: match?.params?.id },
    });
    history.push('/lines');
  }, [match?.params?.id]);

  return (
    <Page
      backButtonTitle={formatMessage('navBarLinesMenuItemLabel')}
      onBackButtonClick={() => history.push('/lines')}
    >
      <Loading
        isLoading={loading}
        text={formatMessage('editorLoadingLineText')}
      >
        <>
          <Stepper
            steps={FIXED_LINE_STEPS.map((step) => formatMessage(step))}
            activeIndex={0}
            onStepClick={() => {}}
          />
          <FlexibleLineEditor
            isEdit={true}
            activeStep={0}
            setActiveStep={() => {}}
            flexibleLine={data?.line!}
            changeFlexibleLine={() => {}}
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
