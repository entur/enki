import Message from './Message';
import http from 'http/http';
import { saveAs } from 'file-saver';
import token from 'http/token';
import { VersionedType } from './base/VersionedType';

type exportStatus = 'inProgress' | 'failed' | 'success';

export type Export = VersionedType & {
  name: string;
  exportStatus?: exportStatus;
  fromDate: string;
  toDate: string;
  dryRun: boolean;
  downloadUrl?: string;
  messages?: Message[];
};

export const toPayload = (selectedExport: Export): Export => ({
  ...selectedExport,
  exportStatus: undefined,
  downloadUrl: undefined,
  messages: undefined
});

export const download = async (selectedExport: Export) => {
  try {
    // feature detection
    // eslint-disable-next-line
    const isFileSaverSupported = !!new Blob();

    const { data } = await http.get(`/uttu/${selectedExport.downloadUrl}`, {
      responseType: 'blob',
      headers: {
        Authorization: token.getBearer()
      }
    });

    const id = selectedExport.id ?? 'EXPORT_ID';

    saveAs(data, `${id.replace(':', '-')}-${selectedExport.created}.zip`);
  } catch (e) {
    alert('Sorry, your browser is not supported for downloads.');
  }
};
