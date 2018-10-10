import Base from './Base';

class Versioned extends Base {
  constructor(data = {}) {
    super();

    this.id = data.id || '';
    this.version = data.version || '';
    this.created = data.created || '';
    this.createdBy = data.createdBy || '';
    this.updated = data.updated || '';
    this.updatedBy = data.updatedBy || '';
  }
}

export default Versioned;
