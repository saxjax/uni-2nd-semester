const { Database } = require(`../Database/Database.js`);

class Document extends Database {
  constructor(request) {
    super();
    this.name = `Document`;
    this.table = `document`;
    this.request = request;
  }

  async getAllSections() {
    // console.log(`prøver at hente : `+ id);
    return this.query(`SELECT *`)
    .then((result) => result)
    .catch((error) => error);
  }

  async getSectionContent(id) {
    // console.log(`prøver at hente : `+ id);
    return this.query(`SELECT content`, `iddocument = "${id}"`)
    .then((result) => result)
    .catch((error) => error);
  }

  async getKeywordsForSection(id) {
    // console.log(`prøver at hente : ` + id);
    this.table = `document_keywords`;
    return this.query(`SELECT *`, `iddocument = "${id}"`)
    .then((result) => result)
    .catch((error) => error);
  }


}


module.exports = {
  Document,
};
