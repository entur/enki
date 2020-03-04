type Data = {
  severity?: string;
  message?: 'NO_VALID_FLEXIBLE_LINES_IN_DATA_SPACE';
};

class Message {
  severity?: string;
  message?: 'NO_VALID_FLEXIBLE_LINES_IN_DATA_SPACE';

  constructor(data: Data = {}) {
    this.severity = data.severity;
    this.message = data.message;
  }
}

export default Message;
