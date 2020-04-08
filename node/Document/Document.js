/* eslint no-console: off */

const { Database } = require(`../Database/Database.js`);
const { Keyword } = require(`../Section/Keyword`);

class Document extends Database {
  constructor(request) {
    super();
    this.name = `Document`;
    this.table = `document`;
    this.iddocument = `Not set`;

    this.request = request;
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

  // async getSectionContent(this.queryId) {
  //   // console.log(`prøver at hente : `+ this.queryId);
  //   return this.query(`SELECT content`, `iddocument = "${this.queryId}"`)
  //     .then((result) => result)
  //     .catch((error) => error);
  // }

  // async getSection(this.queryId) {
  //   // console.log(`prøver at hente : `+ this.queryId);
  //   return this.query(`SELECT *`, `iddocument = "${this.queryId}"`)
  //     .then((result) => result)
  //     .catch((error) => error);
  // }

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
