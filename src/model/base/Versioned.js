class Versioned {
  constructor(data = {}) {
    // If ID is set UTTU will do an update, otherwise a create.
    this.id = data.id;

    // All the below fields are ignored by UTTU.
    this.version = data.version;
    this.created = data.created;
    this.createdBy = data.createdBy;
    this.changed = data.changed;
    this.changedBy = data.changedBy;
  }
}

export default Versioned;
