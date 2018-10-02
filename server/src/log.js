const Base64 = require('js-base64').Base64;
const uuid = require('uuid');

const usernameFromHeader = authHeader =>
  authHeader
    ? JSON.parse(Base64.decode(authHeader.split(' ')[1].split('.')[1]))
        .preferred_username
    : '*anonymous*';

const infoLevel = 'info';
const debugLevel = 'debug';
const errorLevel = 'error';

const appLog = (
  level,
  message,
  authHeader = undefined,
  correlationId = uuid.v4
) => {
  const logMessage = JSON.stringify({
    severity: level,
    username: usernameFromHeader(authHeader),
    correlationId,
    message
  });
  if (level === errorLevel) {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
};

const requestLog = message => console.log(JSON.stringify(message));

module.exports = {
  appLog,
  requestLog,
  usernameFromHeader,
  errorLevel,
  infoLevel,
  debugLevel
};
