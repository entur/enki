import React, { useEffect, useState } from 'react';
import { useLoadDependencies } from './hooks';
import { RouteComponentProps } from 'react-router';
import { MatchParams } from 'http/http';
import { withRouter, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import FlexibleLineEditorSteps from './FlexibleLineEditorSteps';
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
} from 'helpers/validation';
import { isBlank } from 'helpers/forms';
import { isEmpty } from 'ramda';
import { getFlexibleLineFromPath } from 'helpers/url';
import Loading from 'components/Loading';
import { setSavedChanges } from 'actions/editor';
import { loadNetworks, saveNetwork } from 'actions/networks';
import { Network } from 'model/Network';
import Provider from 'model/Provider';
import Page from 'components/Page';
import { deleteLine, saveFlexibleLine } from 'actions/flexibleLines';
import { FLEXIBLE_LINE_STEPS } from './steps';
import './styles.scss';
import LineEditorStepper from 'components/LineEditorStepper';

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
  const [firstPath] = useLocation().pathname.split('/').slice(1);
  const isFlexibleLine = Boolean(
    line?.flexibleLineType || firstPath === 'flexible-lines'
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
      ).then((newNetworkRef) =>
        setLine({ ...newFlexibleLine, networkRef: newNetworkRef })
      );
    }
    // eslint-disable-next-line
  }, [flexibleLines, isLoadingDependencies]);

  const goToLines = () =>
    props.history.push(isFlexibleLine ? '/flexible-lines' : '/lines');

  const isEdit = !isBlank(props.match.params.id);

  const handleOnSaveClick = () => {
    const valid = validFlexibleLine(line);

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

  const onBackButtonClicked = () =>
    editor.isSaved ? goToLines() : setShowConfirm(true);

  const onFlexibleLineChange = (flexibleLine: FlexibleLine) => {
    setLine(flexibleLine);
    dispatch(setSavedChanges(false));
  };

  const authoritiesMissing =
    organisations &&
    filterAuthorities(organisations, providers.active).length === 0;

  return (
    <Page
      backButtonTitle={
        isFlexibleLine
          ? formatMessage('navBarFlexibleLinesMenuItemLabel')
          : formatMessage('navBarLinesMenuItemLabel')
      }
      onBackButtonClick={onBackButtonClicked}
    >
      <>
        <Loading
          className=""
          isLoading={isLoadingDependencies || isEmpty(line)}
          text={formatMessage('editorLoadingLineText')}
        >
          <>
            <LineEditorStepper
              steps={FLEXIBLE_LINE_STEPS.map((step) => formatMessage(step))}
              isValidStepIndex={(i: number) =>
                getMaxAllowedStepIndex(line) >= i
              }
              currentStepIsValid={(i) => currentStepIsValid(i, line)}
              setNextClicked={setNextClicked}
              isEdit={isEdit}
              spoilPristine={nextClicked}
              onDelete={handleDelete}
              isDeleting={isDeleting}
              onSave={handleOnSaveClick}
              isSaving={isSaving}
              isSaved={editor.isSaved}
              redirectTo="/flexible-lines"
              showConfirm={showConfirm}
              setShowConfirm={setShowConfirm}
              authoritiesMissing={authoritiesMissing}
            >
              {(activeStep) => (
                <FlexibleLineEditorSteps
                  activeStep={activeStep}
                  flexibleLine={line}
                  changeFlexibleLine={onFlexibleLineChange}
                  operators={filterNetexOperators(organisations ?? [])}
                  networks={networks || []}
                  spoilPristine={nextClicked}
                />
              )}
            </LineEditorStepper>
          </>
        </Loading>
      </>
    </Page>
  );
};

export default withRouter(EditorFrame);
