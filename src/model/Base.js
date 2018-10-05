import { copyObj } from '../helpers/objects';

class Base {
  withChanges(args) {
    return copyObj(this, args);
  }
}

export default Base;
