/* eslint no-console: off */

const { Database } = require(`../Database/Database.js`);
const { Keyword } = require(`../Section/Keyword`);

class Document extends Database {
  constructor(request) {
    super();
    this.elementtype = `document`;
    this.table = `document`;

    this.queryId = (typeof request.params.queryId !== `undefined` ? request.params.queryId : undefined);
  }

  async getEverything() {
    try {
      this.sectionData = await this.query(`SELECT *`);
    }
    catch (error) {
      console.log(error.message);
    }
    const keyword = new Keyword(this.request);
    try {
      this.keywords = await keyword.getKeywordsForSection();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async getKeywordsForEvaluation() {
    // console.log(`prøver at hente : ` + this.queryId);
    this.table = `document_keywords`;
    return this.query(`SELECT *`, `idevaluations = "${this.queryId}"`)
      .then((result) => result)
      .catch((error) => error);
  }
}


module.exports = {
  Document,
};
