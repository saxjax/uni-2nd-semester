const { Database } = require(`../Database/Database.js`);

/* UNDER CONSTRUCTION */

class Evaluation extends Database {
  /* UNDER CONSTRUCTION */
  constructor(request) {
    super();
    this.elementtype = null;
    this.table = null;
    this.iddocument = `Not set`;
    this.title = `Not set`;

    this.request = request;
    this.queryId = request !== undefined ? request.params.queryId : undefined;
  }

  // Henter alle evalueringer i this.table som er tilknyttet det pågældende iddocument_section
  // på databasen
  // input: iddocument_section
  // output: array af samtlige tilgængelige elementer i den pågældende table som er
  //         knyttet til iddocument_section
  async getEvalForSection() {
    return this.query(`SELECT *`, `iddocument_section = "${this.queryId}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  // async getKeywordsForSection() {
  //   // console.log(`prøver at hente : ` + this.queryId);
  //   this.table = `document_keywords`;
  //   return this.query(`SELECT *`, `iddocument = "${this.queryId}"`)
  //     .then((result) => result)
  //     .catch((error) => error);
  // }
}


module.exports = {
  Evaluation,
};
