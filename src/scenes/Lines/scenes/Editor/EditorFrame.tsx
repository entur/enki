import { Stepper } from '@entur/menu';
import React, { useEffect, useState } from 'react';
import { useLoadDependencies } from './hooks';
import { RouteComponentProps } from 'react-router';
import { MatchParams } from 'http/http';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import FlexibleLineEditor from './index';
import { GlobalState } from 'reducers';
import FlexibleLine, { initFlexibleLine } from 'model/FlexibleLine';
import {
  filterAuthorities,
  filterNetexOperators,
} from 'reducers/organisations';
import { aboutLineStepIsValid } from './validateForm';
import { isBlank } from 'helpers/forms';
import { validJourneyPattern } from './JourneyPatterns/Editor/StopPoints/Editor/validateForm';
import { validServiceJourneys } from './ServiceJourneys/Editor/validate';
import { isEmpty } from 'ramda';
import { getFlexibleLineFromPath } from 'helpers/url';
import PageHeader from 'components/PageHeader';
import NavigateConfirmBox from 'components/ConfirmNavigationDialog';
import Loading from 'components/Loading';
import { setSavedChanges } from 'actions/editor';
import { loadNetworks, saveNetwork } from 'actions/networks';
import { Network } from 'model/Network';
import Provider from 'model/Provider';
import { PrimaryButton } from '@entur/button';
import ConfirmDialog from 'components/ConfirmDialog';

const findNetworkIdByProvider = (
  provider: Provider,
  networks: Network[]
): string | undefined =>
  networks.find(
    (network) =>
      network.id?.split(':')?.[0]?.toUpperCase() === provider.codespace?.xmlns
  )?.id;

const createAndGetNetwork = (
  dispatch: any,
  authorityRef: string,
  activeProvider: Provider
): Promise<string> =>
  dispatch(
    saveNetwork({
      name: activeProvider.codespace?.xmlns,
      authorityRef: authorityRef,
    })
  )
    .then(() => dispatch(loadNetworks()))
    .then((newNetworks: Network[]) =>
      findNetworkIdByProvider(activeProvider, newNetworks)
    );

const EditorFrame = (props: RouteComponentProps<MatchParams>) => {
  const [flexibleLine, setFlexibleLine] = useState<FlexibleLine>({});
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const { formatMessage } = useSelector(selectIntl);
  const dispatch = useDispatch<any>();
  const {
    flexibleLines,
    organisations,
    networks,
    editor,
    providers,
  } = useSelector<GlobalState, GlobalState>((s) => s);

  const [activeStepperIndex, setActiveStepperIndex] = useState(0);
  const FLEXIBLE_LINE_STEPS = [
    formatMessage('stepperAbout'),
    formatMessage('stepperJourneyPattern'),
    formatMessage('stepperServiceJourney'),
    formatMessage('stepperBooking'),
  ];

  const isLoadingDependencies = useLoadDependencies({
    match: props.match,
    history: props.history,
  } as RouteComponentProps<MatchParams>);

  useEffect(() => {
    if (
      !isLoadingDependencies &&
      providers.active &&
      organisations &&
      networks
    ) {
      const authorities = filterAuthorities(organisations, providers.active);
      if (!isBlank(props.match.params.id)) {
        setFlexibleLine(
          getFlexibleLineFromPath(flexibleLines ?? [], props.match)
        );
      } else if (authorities.length > 1) {
        const networkId = findNetworkIdByProvider(providers.active, networks);
        if (networkId) {
          setFlexibleLine(initFlexibleLine(networkId));
        } else {
          createAndGetNetwork(
            dispatch,
            authorities[0].id,
            providers.active
          ).then((networkId) => setFlexibleLine(initFlexibleLine(networkId)));
        }
      }
    }
    // eslint-disable-next-line
  }, [flexibleLines, isLoadingDependencies]);

  const goToLines = () => props.history.push('/lines');

  const getMaxAllowedStepIndex = () => {
    if (!aboutLineStepIsValid(flexibleLine)) return 0;
    else if (!validJourneyPattern(flexibleLine.journeyPatterns)) return 1;
    else if (
      !validServiceJourneys(flexibleLine.journeyPatterns?.[0]?.serviceJourneys)
    )
      return 2;
    else return 3;
  };

  const onStepClicked = (stepIndexClicked: number) => {
    if (getMaxAllowedStepIndex() >= stepIndexClicked) {
      setActiveStepperIndex(stepIndexClicked);
    }
  };

  const onBackButtonClicked = () =>
    editor.isSaved ? goToLines() : setShowConfirm(true);

  const onFlexibleLineChange = (flexibleLine: FlexibleLine) => {
    setFlexibleLine(flexibleLine);
    dispatch(setSavedChanges(false));
  };

  const authoritiesMissing =
    organisations &&
    filterAuthorities(organisations, providers.active).length === 0;

  return (
    <>
      <PageHeader
        withBackButton
        onBackButtonClick={onBackButtonClicked}
        backButtonTitle={formatMessage('navBarLinesMenuItemLabel')}
      />
      <Loading
        className=""
        isLoading={isLoadingDependencies || isEmpty(flexibleLine)}
        text={formatMessage('editorLoadingLineText')}
      >
        <>
          <Stepper
            className="editor-frame"
            steps={FLEXIBLE_LINE_STEPS}
            activeIndex={activeStepperIndex}
            onStepClick={(index) => onStepClicked(index)}
          />
          <FlexibleLineEditor
            isEdit={!isBlank(props.match.params.id)}
            lastStep={FLEXIBLE_LINE_STEPS.length - 1 === activeStepperIndex}
            activeStep={activeStepperIndex}
            setActiveStep={setActiveStepperIndex}
            flexibleLine={flexibleLine}
            changeFlexibleLine={onFlexibleLineChange}
            operators={filterNetexOperators(organisations ?? [])}
          />
        </>
      </Loading>
      {showConfirm && (
        <NavigateConfirmBox
          hideDialog={() => setShowConfirm(false)}
          redirectTo="/lines"
          title={formatMessage('redirectTitle')}
          description={formatMessage('redirectMessage')}
          confirmText={formatMessage('redirectYes')}
          cancelText={formatMessage('redirectNo')}
        />
      )}
      {authoritiesMissing && (
        <ConfirmDialog
          className="authority-missing-modal"
          isOpen={true}
          title={formatMessage('networkAuthorityMissing')}
          message={formatMessage('networkAuthorityMissingDetails')}
          onDismiss={() => props.history.push('/')}
          buttons={[
            <PrimaryButton key="0" onClick={() => props.history.push('/')}>
              {formatMessage('homePage')}
            </PrimaryButton>,
          ]}
        />
      )}
    </>
  );
};

export default withRouter(EditorFrame);
