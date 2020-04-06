const { Database } = require(`../Database/Database.js`);


class Keyword extends Database {
  constructor() {
    super();
    this.name = `Keyword`;
    this.table = `document_keyword`;
    this.idkeyword = `Not set`;
    this.iddocuments = [];
    this.idevaluations = [];
    this.elementtype = `keyword`;
    this.keyword = `Not set`;
  }

  async getKeywordsForSection() {
    // console.log(`prøver at hente : ` + id);
    return this.query(`SELECT *`, `iddocument_section = "${this.idQuery}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  async getKeywordsForEvaluation() {
    // console.log(`prøver at hente : ` + id);
    return this.query(`SELECT *`, `iddocument_section = "${this.idQuery}"`)
      .then((result) => result)
      .catch((error) => error);
  }
}
module.exports = {
  Keyword,
};


// const mockdata = [
// RowDataPacket {
//   idkeyword: '009f4d85-6dd8-11ea-9983-2c4d54532c7a',
//   iddocuments: '83f5173d-685a-11ea-9793-00ff63f710b8',
//   idevaluations: null,
//   elementtype: '`Not set`',
//   keyword: 'melon'
// },
// RowDataPacket {
//   idkeyword: '0d23d6e5-6dd8-11ea-9983-2c4d54532c7a',
//   iddocuments: '83f5173d-685a-11ea-9793-00ff63f710b8',
//   idevaluations: null,
//   elementtype: '`Not set`',
//   keyword: 'orange'
// },
// RowDataPacket {
//   idkeyword: '16e20421-6dd8-11ea-9983-2c4d54532c7a',
//   iddocuments: '83f5173d-685a-11ea-9793-00ff63f710b8',
//   idevaluations: null,
//   elementtype: '`Not set`',
//   keyword: 'pære'
// },
// RowDataPacket {
//   idkeyword: '1d8b1a1f-6dd8-11ea-9983-2c4d54532c7a',
//   iddocuments: '83f5173d-685a-11ea-9793-00ff63f710b8',
//   idevaluations: null,
//   elementtype: '`Not set`',
//   keyword: 'automobil'
// }

// ]
