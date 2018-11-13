class Message {
  constructor(data = {}) {
    this.severity = data.severity;
    this.message = data.message;
  }
}

export default Message;
