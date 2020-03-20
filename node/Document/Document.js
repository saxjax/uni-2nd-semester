const { Database } = require(`../Database/Database.js`);

class Document extends Database {
  constructor(request) {
    super();
    this.name = `Document`;
    this.table = `document`;
    this.request = request;
  }
}

module.exports = {
  Document,
};
