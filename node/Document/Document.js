const { Database } = require(`../Database/Database.js`);

class Document extends Database {
  constructor(request) {
    super();
    this.name = `Document`;
    this.table = `document`;
    this.request = request;
  }

  getAllSections() { 
    return this.get( `*`, `title IS NOT NULL` )
    .then((result) => result )
    .catch((error) => error);
  }

  querySection(id) { 
    return this.get( `SELECT *`, `content = ${id}` )
    .then((result) => result )
    .catch((error) => error);
  }
}


module.exports = {
  Document,
};
