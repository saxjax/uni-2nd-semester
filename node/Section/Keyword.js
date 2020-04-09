const { Database } = require(`../Database/Database.js`);

/* UNDER CONSTRUCTION */

class Keyword extends Database {
  /* Input : requestet der sendes fra en klient, samt inheritance af Database objektet.
   * Output: Et objekt med unikt ID konstrueret med de givne variable tilknyttet det.
   * Variablene over mellemrummet inheriter og overskriver JS database modulet.
   * Elementtype er en kolonne i databasen der angiver type, mens table angiver tabellen.
   * Variablene under mellemrummet har navn efter tabelens SQL database kolonner.
   * groupId variablen hentes fra cookies, da de altid skal være tilgængelige.
   * Værdier sat til null er de parent ID'er som objektet har i sig, der endnu ikke har en funktion.
   * idKeyword variablen hentes fra parametrene, da den sendes med en GET/SELECT request
   * Andre variable hentes fra body, da de sendes med en POST/INSERT eller PUT/UPDATE request
   */
  constructor(req) {
    super();
    this.elementtype = `keyword`;
    this.table = `document_keyword`;

    this.idGroup         = (typeof req.session.idGroup  !== `undefined` ? req.session.idGroup  : undefined);
    this.idUser          = null;
    this.idDocument      = null;
    this.idSection       = null;
    this.idKeyword       = (typeof req.params.idKeyword !== `undefined` ? req.params.idKeyword : undefined);
    this.iddocuments     = [];
    this.idevaluations   = [];
    this.documentKeyword = (typeof req.params.documentKeyword     !== `undefined` ? req.params.documentKeyword      : undefined);
  }

  /* UNDER CONSTRUCTION */
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
