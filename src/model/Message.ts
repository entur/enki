type Data = {
  severity?: string;
  message?: string;
};

class Message {
  severity?: string;
  message?: string;

  constructor(data: Data = {}) {
    this.severity = data.severity;
    this.message = data.message;
  }
}

export default Message;
