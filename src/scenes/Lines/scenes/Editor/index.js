import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Label,
  TextField,
  TextArea,
  DropDown,
  DropDownOptions
} from '@entur/component-library';

import {
  DestinationDisplay,
  FlexibleLine,
  JourneyPattern,
  StopPointInJourneyPattern
} from '../../../../model/index';
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

import './styles.css';

const DEFAULT_SELECT_LABEL = '--- velg ---';
const DEFAULT_SELECT_VALUE = '-1';

class FlexibleLineEditor extends Component {
  state = {
    flexibleLine: null,
    operatorSelection: DEFAULT_SELECT_VALUE,
    networkSelection: DEFAULT_SELECT_VALUE,
    stopPlaceSelection: DEFAULT_SELECT_VALUE,

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
            networkSelection: flexibleLine.networkRef,
            stopPlaceSelection:
              flexibleLine.journeyPatterns.length > 0
                ? flexibleLine.journeyPatterns[0].pointsInSequence[0]
                    .flexibleStopPlaceRef
                : DEFAULT_SELECT_VALUE
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

  handleFieldChange(field, value) {
    this.setState(({ flexibleLine }) => ({
      flexibleLine: flexibleLine.withChanges({ [field]: value })
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

  handleStopPlaceSelectionChange(stopPlaceSelection) {
    let journeyPatterns = [];
    if (stopPlaceSelection !== DEFAULT_SELECT_VALUE) {
      const stopPoint = new StopPointInJourneyPattern({
        flexibleStopPlaceRef: stopPlaceSelection,
        destinationDisplay: new DestinationDisplay({ frontText: 'Destination' })
      });
      const journeyPattern = new JourneyPattern({
        pointsInSequence: [stopPoint, stopPoint]
      });
      journeyPatterns.push(journeyPattern);
    }
    this.setState(({ flexibleLine }) => ({
      flexibleLine: flexibleLine.withChanges({ journeyPatterns }),
      stopPlaceSelection
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
      stopPlaceSelection,
      isSaving,
      isDeleteDialogOpen,
      isDeleting
    } = this.state;

    const operators = organisations.filter(org =>
      org.types.includes(ORGANISATION_TYPE.OPERATOR)
    );

    const isLoadingLine = !flexibleLine;
    const isLoadingDependencies = !networks || !flexibleStopPlaces;

    return (
      <div className="line-editor">
        <div className="header">
          <h2>{match.params.id ? 'Rediger' : 'Opprett'} linje</h2>
          {match.params.id && (
            <Button
              variant="negative"
              onClick={() => this.setDeleteDialogOpen(true)}
              disabled={isDeleting}
            >
              Slett
            </Button>
          )}
        </div>

        {!isLoadingLine && !isLoadingDependencies ? (
          <OverlayLoader
            isLoading={isSaving || isDeleting}
            text={(isSaving ? 'Lagrer' : 'Sletter') + ' linjen...'}
          >
            <div className="line-form">
              <Label>Navn</Label>
              <TextField
                type="text"
                value={flexibleLine.name}
                onChange={e => this.handleFieldChange('name', e.target.value)}
              />

              <Label>Beskrivelse</Label>
              <TextArea
                type="text"
                value={flexibleLine.description}
                onChange={e =>
                  this.handleFieldChange('description', e.target.value)
                }
              />

              <Label>Privat kode</Label>
              <TextField
                type="text"
                value={flexibleLine.privateCode}
                onChange={e =>
                  this.handleFieldChange('privateCode', e.target.value)
                }
              />

              <Label>Offentlig kode</Label>
              <TextField
                type="text"
                value={flexibleLine.publicCode}
                onChange={e =>
                  this.handleFieldChange('publicCode', e.target.value)
                }
              />

              <Label>Operatør</Label>
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
                  <DropDownOptions key={o.name} label={o.name} value={o.id} />
                ))}
              </DropDown>

              <Label>Nettverk</Label>
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
                  <DropDownOptions key={n.name} label={n.name} value={n.id} />
                ))}
              </DropDown>

              <Label>Stoppested</Label>
              <DropDown
                value={stopPlaceSelection}
                onChange={e =>
                  this.handleStopPlaceSelectionChange(e.target.value)
                }
              >
                <DropDownOptions
                  label={DEFAULT_SELECT_LABEL}
                  value={DEFAULT_SELECT_VALUE}
                />
                {flexibleStopPlaces.map(fsp => (
                  <DropDownOptions
                    key={fsp.name}
                    label={fsp.name}
                    value={fsp.id}
                  />
                ))}
              </DropDown>

              <div className="save-button-container">
                <Button variant="success" onClick={::this.handleOnSaveClick}>
                  Lagre
                </Button>
              </div>
            </div>
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
