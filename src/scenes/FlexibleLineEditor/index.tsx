import { setSavedChanges } from 'actions/editor';
import { deleteLine, saveFlexibleLine } from 'actions/flexibleLines';
import LineEditorStepper from 'components/LineEditorStepper';
import Loading from 'components/Loading';
import Page from 'components/Page';
import { useConfig } from 'config/ConfigContext';
import { isBlank } from 'helpers/forms';
import { getFlexibleLineFromPath } from 'helpers/url';
import {
  currentFlexibleLineStepIsValid,
  getMaxAllowedFlexibleLineStepIndex,
  validFlexibleLine,
} from 'helpers/validation';
import FlexibleLine, { initFlexibleLine } from 'model/FlexibleLine';
import { filterAuthorities, filterNetexOperators } from 'model/Organisation';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import FlexibleLineEditorSteps from './FlexibleLineEditorSteps';
import { useLoadDependencies } from './hooks';
import { FLEXIBLE_LINE_STEPS } from './steps';
import './styles.scss';

const EditorFrame = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [line, setLine] = useState<FlexibleLine | undefined>();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [nextClicked, setNextClicked] = useState<boolean>(false);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [firstPath] = useLocation().pathname.split('/').slice(1);
  const isFlexibleLine = Boolean(
    line?.flexibleLineType || firstPath === 'flexible-lines',
  );

  const intl = useIntl();
  const { formatMessage } = intl;
  const dispatch = useDispatch<any>();

  const flexibleLines = useAppSelector((state) => state.flexibleLines);
  const organisations = useAppSelector((state) => state.organisations);
  const networks = useAppSelector((state) => state.networks);
  const editor = useAppSelector((state) => state.editor);

  const { isLoadingDependencies, refetchFlexibleLine } = useLoadDependencies();

  const config = useConfig();

  useEffect(() => {
    if (!isBlank(params.id))
      return setLine(getFlexibleLineFromPath(flexibleLines ?? [], params));

    return setLine(initFlexibleLine());

    // eslint-disable-next-line
  }, [flexibleLines, params.id]);

  const goToLines = () =>
    navigate(isFlexibleLine ? '/flexible-lines' : '/lines');

  const isEdit = !isBlank(params.id);

  const handleOnSaveClick = () => {
    setNextClicked(true);
    setSaving(true);
    dispatch(saveFlexibleLine(line!, intl))
      .then(() => dispatch(setSavedChanges(true)))
      .then(() => !isEdit && goToLines())
      .then(() => isEdit && refetchFlexibleLine())
      // noop just catching to avoid unhandled rejection
      // error message is handled upstream
      .catch(() => {})
      .finally(() => setSaving(false));
    setNextClicked(false);
  };

  const handleDelete = () => {
    if (line?.id) {
      setDeleting(true);
      dispatch(deleteLine(line, intl)).then(() => goToLines());
    }
  };

  const onBackButtonClicked = () =>
    editor.isSaved ? goToLines() : setShowConfirm(true);

  const onFlexibleLineChange = (flexibleLine: FlexibleLine) => {
    setLine(flexibleLine);
    dispatch(setSavedChanges(false));
  };

  const authoritiesMissing =
    organisations && filterAuthorities(organisations).length === 0;

  return (
    <Page
      backButtonTitle={
        isFlexibleLine
          ? formatMessage({ id: 'navBarFlexibleLinesMenuItemLabel' })
          : formatMessage({ id: 'navBarLinesMenuItemLabel' })
      }
      onBackButtonClick={onBackButtonClicked}
    >
      <>
        <Loading
          className=""
          isLoading={isLoadingDependencies}
          text={formatMessage({ id: 'editorLoadingLineText' })}
        >
          <>
            {!isLoadingDependencies && !line && (
              <Navigate to="/flexible-lines" replace />
            )}
            {!isLoadingDependencies && line && (
              <LineEditorStepper
                steps={FLEXIBLE_LINE_STEPS.map((step) =>
                  formatMessage({ id: step }),
                )}
                isValidStepIndex={(i: number) =>
                  getMaxAllowedFlexibleLineStepIndex(line!, intl) >= i
                }
                isLineValid={validFlexibleLine(line!, intl)}
                currentStepIsValid={(i) =>
                  currentFlexibleLineStepIsValid(i, line, intl)
                }
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
                    flexibleLine={line!}
                    changeFlexibleLine={onFlexibleLineChange}
                    operators={filterNetexOperators(organisations ?? [])}
                    networks={networks || []}
                    spoilPristine={nextClicked}
                  />
                )}
              </LineEditorStepper>
            )}
          </>
        </Loading>
      </>
    </Page>
  );
};

export default EditorFrame;
