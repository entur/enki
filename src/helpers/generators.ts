import uuid from 'uuid';

export const createUuid = () => {
  return uuid.v4().substr(0, 8);
};
