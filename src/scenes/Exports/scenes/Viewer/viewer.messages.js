import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'exports.viewer.header',
    defaultMessage: 'Vis eksport'
  },
  nameLabel: {
    id: 'exports.viewer.nameLabel',
    defaultMessage: 'Navn'
  },
  fromDateLabel: {
    id: 'exports.viewer.fromDateLabel',
    defaultMessage: 'Fra dato'
  },
  toDateLabel: {
    id: 'exports.viewer.toDateLabel',
    defaultMessage: 'Til data'
  },
  dryRunLabel: {
    id: 'exports.viewer.dryRunLabel',
    defaultMessage: 'Tørrkjøring'
  },
  dryRunYes: {
    id: 'exports.viewer.dryRunYes',
    defaultMessage: 'Ja'
  },
  dryRunNo: {
    id: 'exports.viewer.dryRunNo',
    defaultMessage: 'Nei'
  },
  statusLabel: {
    id: 'exports.viewer.statusLabel',
    defaultMessage: 'Status'
  },
  downloadLabel: {
    id: 'exports.viewer.downloadLabel',
    defaultMessage: 'Last ned eksporterte filer'
  },
  downloadLinkText: {
    id: 'exports.viewer.downloadLinkText',
    defaultMessage: 'Last ned'
  },
  messagesLabel: {
    id: 'exports.viewer.messagesLabel',
    defaultMessage: 'Meldinger'
  },
  loadingText: {
    id: 'exports.viewer.loadingText',
    defaultMessage: 'Laster inn eksport...'
  }
});

export const exportStatuses = defineMessages({
  inProgress: {
    id: 'exports.viewer.exportStatuses.inProgress',
    defaultMessage: 'Pågår'
  },
  failed: {
    id: 'exports.viewer.exportStatuses.failed',
    defaultMessage: 'Feilet'
  },
  success: {
    id: 'exports.viewer.exportStatuses.success',
    defaultMessage: 'Ferdig'
  }
});

export const exportMessages = defineMessages({
  NO_VALID_FLEXIBLE_LINES_IN_DATA_SPACE: {
    id: 'exports.viewer.exportMessages.NO_VALID_FLEXIBLE_LINES_IN_DATA_SPACE',
    defaultMessage: 'Ingen gyldig linjer i datagrunnlaget'
  }
});
