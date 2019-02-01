import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  TextField,
  TextArea,
  DropDown,
  DropDownOptions,
  Tabs,
  Tab,
  FormGroup
} from '@entur/component-library';

import { FlexibleLine } from '../../../../model';
import {
  ORGANISATION_TYPE,
  FLEXIBLE_LINE_TYPE,
  VEHICLE_MODE,
  VEHICLE_SUBMODE
} from '../../../../model/enums';
import {
  deleteFlexibleLineById,
  loadFlexibleLineById,
  saveFlexibleLine
} from '../../../../actions/flexibleLines';
import { loadNetworks } from '../../../../actions/networks';
import { loadFlexibleStopPlaces } from '../../../../actions/flexibleStopPlaces';
import Loading from '../../../../components/Loading';
import OverlayLoader from '../../../../components/OverlayLoader';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import BookingArrangementEditor from './BookingArrangementEditor';
import JourneyPatternsEditor from './JourneyPatterns';

import './styles.css';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

const TABS = Object.freeze({
  GENERAL: 'general',
  BOOKING: 'booking',
  JOURNEY_PATTERNS: 'journeyPatterns'
});

class FlexibleLineEditor extends Component {
  state = {
    flexibleLine: null,
    operatorSelection: DEFAULT_SELECT_VALUE,
    networkSelection: DEFAULT_SELECT_VALUE,
    activeTab: TABS.GENERAL,
    journeyPatternInDialog: null,
    journeyPatternIndexInDialog: -1,
    isSaving: false,
    isDeleteDialogOpen: false,
    isDeleting: false
  };

  componentDidMount() {
    const { dispatch, match, history } = this.props;

    dispatch(loadNetworks());
    dispatch(loadFlexibleStopPlaces());

    if (match.params.id) {
      dispatch(loadFlexibleLineById(match.params.id))
        .then(flexibleLine =>
          this.setState({
            flexibleLine,
            operatorSelection: flexibleLine.operatorRef,
            networkSelection: flexibleLine.networkRef
          })
        )
        .catch(() => history.push('/lines'));
    } else {
      this.setState({
        flexibleLine: new FlexibleLine({
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: VEHICLE_SUBMODE.LOCAL_BUS,
          flexibleLineType: FLEXIBLE_LINE_TYPE.FLEXIBLE_AREAS_ONLY
        })
      });
    }
  }

  handleFieldChange(field, value, multi = false) {
    const { flexibleLine } = this.state;

    let newValue = value;
    if (multi) {
      newValue = flexibleLine[field].includes(value)
        ? flexibleLine[field].filter(v => v !== value)
        : flexibleLine[field].concat(value);
    }

    this.setState(({ flexibleLine }) => ({
      flexibleLine: flexibleLine.withChanges({ [field]: newValue })
    }));
  }

  handleOperatorSelectionChange(operatorSelection) {
    this.setState({
      flexibleLine: this.state.flexibleLine.withChanges({
        operatorRef:
          operatorSelection !== DEFAULT_SELECT_VALUE
            ? operatorSelection
            : undefined
      }),
      operatorSelection
    });
  }

  handleNetworkSelectionChange(networkSelection) {
    this.setState({
      flexibleLine: this.state.flexibleLine.withChanges({
        networkRef:
          networkSelection !== DEFAULT_SELECT_VALUE
            ? networkSelection
            : undefined
      }),
      networkSelection
    });
  }

  addJourneyPattern(journeyPattern) {
    this.setState(({ flexibleLine }) => ({
      flexibleLine: flexibleLine.addJourneyPattern(journeyPattern)
    }));
  }

  updateJourneyPattern(index, journeyPattern) {
    this.setState(({ flexibleLine }) => ({
      flexibleLine: flexibleLine.updateJourneyPattern(index, journeyPattern)
    }));
  }

  handleOnSaveClick() {
    const { dispatch, history } = this.props;
    this.setState({ isSaving: true });
    dispatch(saveFlexibleLine(this.state.flexibleLine))
      .then(() => history.push('/lines'))
      .finally(() => this.setState({ isSaving: false }));
  }

  setDeleteDialogOpen(open) {
    this.setState({ isDeleteDialogOpen: open });
  }

  handleDelete() {
    const { dispatch, history } = this.props;
    this.setState({
      isDeleteDialogOpen: false,
      isDeleting: true
    });
    dispatch(deleteFlexibleLineById(this.state.flexibleLine.id))
      .then(() => history.push('/lines'))
      .finally(() => this.setState({ isDeleting: false }));
  }

  render() {
    const { match, organisations, networks, flexibleStopPlaces } = this.props;
    const {
      flexibleLine,
      operatorSelection,
      networkSelection,
      activeTab,
      isSaving,
      isDeleteDialogOpen,
      isDeleting
    } = this.state;

    const operators = organisations.filter(org =>
      org.types.includes(ORGANISATION_TYPE.OPERATOR)
    );

    const isLoadingLine = !flexibleLine;
    const isLoadingDependencies = !networks || !flexibleStopPlaces;

    const isDeleteDisabled =
      isLoadingLine || isLoadingDependencies || isDeleting;

    return (
      <div className="line-editor">
        <div className="header">
          <h2>{match.params.id ? 'Rediger' : 'Opprett'} linje</h2>

          <div className="buttons">
            <Button variant="success" onClick={::this.handleOnSaveClick}>
              Lagre
            </Button>

            {match.params.id && (
              <Button
                variant="negative"
                onClick={() => this.setDeleteDialogOpen(true)}
                disabled={isDeleteDisabled}
              >
                Slett
              </Button>
            )}
          </div>
        </div>

        {!isLoadingLine && !isLoadingDependencies ? (
          <OverlayLoader
            isLoading={isSaving || isDeleting}
            text={(isSaving ? 'Lagrer' : 'Sletter') + ' linjen...'}
          >
            <Tabs
              selected={activeTab}
              onChange={activeTab => this.setState({ activeTab })}
            >
              <Tab
                value={TABS.GENERAL}
                label="Generelt"
                className="general-tab"
              >
                <FormGroup
                  className="form-section"
                  inputId="name"
                  title="* Navn"
                >
                  <TextField
                    type="text"
                    value={flexibleLine.name}
                    onChange={e =>
                      this.handleFieldChange('name', e.target.value)
                    }
                  />
                </FormGroup>

                <FormGroup
                  className="form-section"
                  inputId="description"
                  title="Beskrivelse"
                >
                  <TextArea
                    type="text"
                    value={flexibleLine.description}
                    onChange={e =>
                      this.handleFieldChange('description', e.target.value)
                    }
                  />
                </FormGroup>

                <FormGroup
                  className="form-section"
                  inputId="privateCode"
                  title="Privat kode"
                >
                  <TextField
                    type="text"
                    value={flexibleLine.privateCode}
                    onChange={e =>
                      this.handleFieldChange('privateCode', e.target.value)
                    }
                  />
                </FormGroup>

                <FormGroup
                  className="form-section"
                  inputId="publicCode"
                  title="* Offentlig kode"
                >
                  <TextField
                    type="text"
                    value={flexibleLine.publicCode}
                    onChange={e =>
                      this.handleFieldChange('publicCode', e.target.value)
                    }
                  />
                </FormGroup>

                <FormGroup
                  className="form-section"
                  inputId="operator"
                  title="Operatør"
                >
                  <DropDown
                    value={operatorSelection}
                    onChange={e =>
                      this.handleOperatorSelectionChange(e.target.value)
                    }
                  >
                    <DropDownOptions
                      label={DEFAULT_SELECT_LABEL}
                      value={DEFAULT_SELECT_VALUE}
                    />
                    {operators.map(o => (
                      <DropDownOptions
                        key={o.name}
                        label={o.name}
                        value={o.id}
                      />
                    ))}
                  </DropDown>
                </FormGroup>

                <FormGroup
                  className="form-section"
                  inputId="network"
                  title="* Nettverk"
                >
                  <DropDown
                    value={networkSelection}
                    onChange={e =>
                      this.handleNetworkSelectionChange(e.target.value)
                    }
                  >
                    <DropDownOptions
                      label={DEFAULT_SELECT_LABEL}
                      value={DEFAULT_SELECT_VALUE}
                    />
                    {networks.map(n => (
                      <DropDownOptions
                        key={n.name}
                        label={n.name}
                        value={n.id}
                      />
                    ))}
                  </DropDown>
                </FormGroup>
              </Tab>

              <Tab value={TABS.JOURNEY_PATTERNS} label="Journey Patterns">
                <JourneyPatternsEditor
                  journeyPatterns={flexibleLine.journeyPatterns}
                  onChange={jps =>
                    this.handleFieldChange('journeyPatterns', jps)
                  }
                />
              </Tab>

              <Tab
                value={TABS.BOOKING}
                label="Bestilling"
                className="booking-tab"
              >
                <BookingArrangementEditor
                  bookingArrangement={flexibleLine.bookingArrangement}
                  onChange={b =>
                    this.handleFieldChange('bookingArrangement', b)
                  }
                />
              </Tab>
            </Tabs>
          </OverlayLoader>
        ) : (
          <Loading
            text={`Laster inn ${
              isLoadingLine ? 'linje' : 'nettverk og stoppesteder'
            }...`}
          />
        )}

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title="Slette linje"
          message="Er du sikker på at du ønsker å slette denne linjen?"
          buttons={[
            <Button
              key={2}
              onClick={() => this.setDeleteDialogOpen(false)}
              variant="secondary"
              width="md"
              className="action-button"
            >
              Nei
            </Button>,
            <Button
              key={1}
              onClick={::this.handleDelete}
              variant="success"
              width="md"
              className="action-button"
            >
              Ja
            </Button>
          ]}
          onClose={() => this.setDeleteDialogOpen(false)}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ organisations, networks, flexibleStopPlaces }) => ({
  organisations,
  networks,
  flexibleStopPlaces
});

export default connect(mapStateToProps)(FlexibleLineEditor);
