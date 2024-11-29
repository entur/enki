import { saveAs } from 'file-saver';
import http from 'api/http';
import { VersionedType } from 'model/VersionedType';
import { EXPORT_STATUS } from 'model/enums';
import Line from './Line';
import Message from './Message';
import { showErrorNotification } from 'actions/notification';
import { IntlShape } from 'react-intl';

export type ExportLineAssociation = VersionedType & {
  lineRef?: string;
  line?: Line[];
};

export type Export = VersionedType & {
  name: string;
  exportStatus?: EXPORT_STATUS;
  dryRun: boolean;
  downloadUrl?: string;
  messages?: Message[];
  lineAssociations?: ExportLineAssociation[];
};

export const newExport = (): Export => {
  return { name: '', dryRun: false };
};

export const toPayload = (selectedExport: Export): Export => {
  const { exportStatus, downloadUrl, messages, ...rest } = selectedExport;
  return rest;
};

export const download = async (
  apiBase: string | undefined,
  selectedExport: Export,
  token: string,
  intl: IntlShape,
) => {
  let isFileSaverSupported = false;
  try {
    // feature detection
    // eslint-disable-next-line
    isFileSaverSupported = !!new Blob();
  } catch (e) {
    showErrorNotification(
      intl.formatMessage({ id: 'exports.download.unsupportedBrowser.title' }),
      intl.formatMessage({ id: 'exports.download.unsupportedBrowser.message' }),
    );
    return;
  }

  if (!isFileSaverSupported) {
    showErrorNotification(
      intl.formatMessage({ id: 'exports.download.unsupportedBrowser.title' }),
      intl.formatMessage({ id: 'exports.download.unsupportedBrowser.message' }),
    );
    return;
  }

  try {
    const { data } = await http.get(
      `${apiBase || ''}/${selectedExport.downloadUrl}`,
      {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const id = selectedExport.id ?? 'EXPORT_ID';
    saveAs(data, `${id.replace(':', '-')}-${selectedExport.created}.zip`);
  } catch (e) {
    showErrorNotification(
      intl.formatMessage({ id: 'exports.download.error.title' }),
      intl.formatMessage({ id: 'exports.download.error.message' }),
    );
  }
};
