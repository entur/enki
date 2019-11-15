import { copyObj } from 'helpers/objects';

class Base {
  withChanges(args) {
    return copyObj(this, args);
  }

  withFieldChange(field, value, multi = false) {
    let newValue = value;
    if (multi) {
      newValue = this[field].includes(value)
        ? this[field].filter(v => v !== value)
        : this[field].concat(value);
    }
    return this.withChanges({ [field]: newValue });
  }
}

export default Base;
