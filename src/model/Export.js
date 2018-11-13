import Versioned from './base/Versioned';
import Message from './Message';

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
}

export default Export;
