import Versioned from './base/Versioned';
import Message from './Message';
import http from '../http/http';
import { saveAs } from 'file-saver';
import token from '../http/token';

class Export extends Versioned {
  constructor(data = {}) {
    super(data);

    this.name = data.name;
    this.exportStatus = data.exportStatus;
    this.fromDate = data.fromDate;
    this.toDate = data.toDate;
    this.dryRun = data.dryRun;
    this.downloadUrl = data.downloadUrl;
    this.messages = (data.messages || []).map(m => new Message(m));
  }

  toPayload() {
    const payload = this.withChanges();
    delete payload.exportStatus;
    delete payload.downloadUrl;
    delete payload.messages;
    return payload;
  }

  async download() {
    try {
      // feature detection
      // eslint-disable-next-line
      const isFileSaverSupported = !!new Blob();

      const { data } = await http.get(`/uttu/${this.downloadUrl}`, {
        responseType: 'blob',
        headers: {
          Authorization: token.getBearer()
        }
      });

      saveAs(data, `${this.id.replace(':', '-')}-${this.created}.zip`);
    } catch (e) {
      alert('Sorry, your browser is not supported for downloads.');
    }
  }
}

export default Export;
