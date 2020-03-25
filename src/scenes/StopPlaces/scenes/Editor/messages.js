import { defineMessages } from 'react-intl';

export default defineMessages({
  description: {
    id: 'stopPlaces.editor.description',
    defaultMessage:
      'Opprett et stoppested eller område, enten ved å fylle inn en liste med koordinater på GeoJSON-format, eller ved å klikke i kartet.'
  },
  createHeader: {
    id: 'stopPlaces.editor.createHeader',
    defaultMessage: 'Opprett stoppested'
  },
  editHeader: {
    id: 'stopPlaces.editor.editHeader',
    defaultMessage: 'Rediger stoppested'
  },
  saveButtonText: {
    id: 'stopPlaces.editor.saveButtonText',
    defaultMessage: 'Lagre'
  },
  deleteButtonText: {
    id: 'stopPlaces.editor.deleteButtonText',
    defaultMessage: 'Slett'
  },
  drawPolygonButtonText: {
    id: 'stopPlaces.editor.drawPolygonButtonText',
    defaultMessage: 'Tegn koordinater i kart'
  },
  savingOverlayLoaderText: {
    id: 'stopPlaces.editor.savingOverlayLoaderText',
    defaultMessage: 'Lagrer stoppestedet...'
  },
  deletingOverlayLoaderText: {
    id: 'stopPlaces.editor.deletingOverlayLoaderText',
    defaultMessage: 'Sletter stoppestedet...'
  },
  nameFormLabelText: {
    id: 'stopPlaces.editor.nameFormLabelText',
    defaultMessage: 'Navn *'
  },
  descriptionFormLabelText: {
    id: 'stopPlaces.editor.descriptionFormLabelText',
    defaultMessage: 'Beskrivelse'
  },
  privateCodeFormLabelText: {
    id: 'stopPlaces.editor.privateCodeFormLabelText',
    defaultMessage: 'Privat kode'
  },
  coordinatesFormLabelText: {
    id: 'stopPlaces.editor.coordinatesFormLabelText',
    defaultMessage: 'Koordinater i GeoJson-rekkefølge [Long, Lat]'
  },
  invalidCoordinates: {
    id: 'stopPlaces.editor.error.coordinates',
    defaultMessage: 'Koordinatene er ikke på rett format'
  },
  loadingStopPlaceText: {
    id: 'stopPlaces.editor.loadingStopPlaceText',
    defaultMessage: 'Laster inn stoppestedet'
  },
  loadingDependenciesText: {
    id: 'stopPlaces.editor.loadingDependenciesText',
    defaultMessage: 'Laster inn avhengigheter'
  },
  deleteStopPlaceDialogTitle: {
    id: 'stopPlaces.editor.deleteStopPlaceDialogTitle',
    defaultMessage: 'Slette stoppested'
  },
  deleteStopPlaceDialogMessage: {
    id: 'stopPlaces.editor.deleteStopPlaceDialogMessage',
    defaultMessage: 'Er du sikker på at du ønsker å slette dette stoppestedet?'
  },
  deleteStopPlaceDialogCancelButtonText: {
    id: 'stopPlaces.editor.deleteStopPlaceDialogCancelButtonText',
    defaultMessage: 'Nei'
  },
  deleteStopPlaceDialogConfirmButtonText: {
    id: 'stopPlaces.editor.deleteStopPlaceDialogConfirmButtonText',
    defaultMessage: 'Ja'
  }
});
