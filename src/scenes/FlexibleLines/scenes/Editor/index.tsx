import { Stepper } from '@entur/menu';
import React, { useEffect, useState } from 'react';
import { useLoadDependencies } from './hooks';
import { RouteComponentProps } from 'react-router';
import { MatchParams } from 'http/http';
import { withRouter, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import FlexibleLineEditor from 'scenes/FlexibleLines/scenes/Editor/FlexibleLineEditor';
import { GlobalState } from 'reducers';
import FlexibleLine, { initFlexibleLine } from 'model/FlexibleLine';
import {
  filterAuthorities,
  filterNetexOperators,
} from 'reducers/organisations';
import {
  currentStepIsValid,
  getMaxAllowedStepIndex,
  validFlexibleLine,
} from './validateForm';
import { isBlank } from 'helpers/forms';
import { isEmpty } from 'ramda';
import { getFlexibleLineFromPath } from 'helpers/url';
import NavigateConfirmBox from 'components/ConfirmNavigationDialog';
import Loading from 'components/Loading';
import { setSavedChanges } from 'actions/editor';
import { loadNetworks, saveNetwork } from 'actions/networks';
import { Network } from 'model/Network';
import Provider from 'model/Provider';
import { PrimaryButton } from '@entur/button';
import ConfirmDialog from 'components/ConfirmDialog';
import Page from 'components/Page';
import NavigationButtons from './NavigationButtons';
import { deleteLine, saveFlexibleLine } from 'actions/flexibleLines';
import { FLEXIBLE_LINE_STEPS, FIXED_LINE_STEPS } from './steps';
import './styles.scss';

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
    saveNetwork(
      {
        name: activeProvider.codespace?.xmlns ?? 'New network',
        authorityRef: authorityRef,
      },
      false
    )
  )
    .then(() => dispatch(loadNetworks()))
    .then((newNetworks: Network[]) =>
      findNetworkIdByProvider(activeProvider, newNetworks)
    );

const EditorFrame = (props: RouteComponentProps<MatchParams>) => {
  const [line, setLine] = useState<FlexibleLine>({});
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [nextClicked, setNextClicked] = useState<boolean>(false);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [lastPath] = useLocation().pathname.split('/').slice(-1);
  const isFlexibleLine = Boolean(
    line?.flexibleLineType || lastPath === 'flexible'
  );

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

  const isLoadingDependencies = useLoadDependencies({
    match: props.match,
    history: props.history,
  } as RouteComponentProps<MatchParams>);

  useEffect(() => {
    if (
      isLoadingDependencies ||
      !providers.active ||
      !organisations ||
      !networks
    )
      return;

    const authorities = filterAuthorities(organisations, providers.active);
    if (!isBlank(props.match.params.id))
      return setLine(getFlexibleLineFromPath(flexibleLines ?? [], props.match));

    const newFlexibleLine: FlexibleLine = initFlexibleLine();

    if (networks.length > 1 || authorities.length === 0)
      return setLine(newFlexibleLine);

    const networkRef = findNetworkIdByProvider(providers.active, networks);
    if (networkRef) {
      setLine({ ...newFlexibleLine, networkRef });
    } else {
      createAndGetNetwork(
        dispatch,
        authorities[0].id,
        providers.active
      ).then((networkRef) => setLine({ ...newFlexibleLine, networkRef }));
    }
    // eslint-disable-next-line
  }, [flexibleLines, isLoadingDependencies]);

  const goToLines = () => props.history.push('/flexible-lines');

  const onStepClicked = (stepIndexClicked: number) => {
    if (getMaxAllowedStepIndex(line, isFlexibleLine) >= stepIndexClicked) {
      setActiveStepperIndex(stepIndexClicked);
    }
  };

  const isEdit = !isBlank(props.match.params.id);

  const handleOnSaveClick = () => {
    const valid = validFlexibleLine(line, isFlexibleLine);

    setNextClicked(true);
    if (valid) {
      setSaving(true);
      dispatch(saveFlexibleLine(line))
        .then(() => dispatch(setSavedChanges(true)))
        .then(() => !isEdit && goToLines())
        // noop just catching to avoid unhandled rejection
        // error message is handled upstream
        .catch(() => {})
        .finally(() => setSaving(false));
      setNextClicked(false);
    }
  };

  const handleDelete = () => {
    if (line.id) {
      setDeleting(true);
      dispatch(deleteLine(line)).then(() => goToLines());
    }
  };

  const onNextClicked = () => {
    if (currentStepIsValid(activeStepperIndex, line, isFlexibleLine)) {
      setActiveStepperIndex(activeStepperIndex + 1);
      setNextClicked(false);
    } else {
      setNextClicked(true);
    }
  };

  const onBackButtonClicked = () =>
    editor.isSaved ? goToLines() : setShowConfirm(true);

  const onFlexibleLineChange = (flexibleLine: FlexibleLine) => {
    setLine(flexibleLine);
    dispatch(setSavedChanges(false));
  };

  const authoritiesMissing =
    organisations &&
    filterAuthorities(organisations, providers.active).length === 0;

  const STEPS = isFlexibleLine ? FLEXIBLE_LINE_STEPS : FIXED_LINE_STEPS;

  return (
    <Page
      backButtonTitle={formatMessage('navBarFlexibleLinesMenuItemLabel')}
      onBackButtonClick={onBackButtonClicked}
    >
      <>
        <Loading
          className=""
          isLoading={isLoadingDependencies || isEmpty(line)}
          text={formatMessage('editorLoadingLineText')}
        >
          <>
            <Stepper
              className="editor-frame"
              steps={STEPS.map((step) => formatMessage(step))}
              activeIndex={activeStepperIndex}
              onStepClick={(index) => onStepClicked(index)}
            />
            <FlexibleLineEditor
              isEdit={isEdit}
              activeStep={activeStepperIndex}
              setActiveStep={setActiveStepperIndex}
              flexibleLine={line}
              changeFlexibleLine={onFlexibleLineChange}
              operators={filterNetexOperators(organisations ?? [])}
              networks={networks ?? []}
              spoilPristine={nextClicked}
              isSaving={isSaving}
              isDeleting={isDeleting}
              isFlexibleLine={isFlexibleLine}
              steps={STEPS}
            />
            <NavigationButtons
              editMode={isEdit}
              firstStep={activeStepperIndex === 0}
              lastStep={activeStepperIndex === STEPS.length - 1}
              onDelete={handleDelete}
              onSave={handleOnSaveClick}
              onNext={onNextClicked}
              onCancel={onBackButtonClicked}
              onPrevious={() =>
                setActiveStepperIndex(Math.max(activeStepperIndex - 1, 0))
              }
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
    </Page>
  );
};

export default withRouter(EditorFrame);
