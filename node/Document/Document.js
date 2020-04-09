/* eslint no-console: off */

const { Database } = require(`../Database/Database.js`);
const { Section } = require(`../Section/Section`);
const { Keyword } = require(`../Section/Keyword`);

class Document extends Database {
  /* UNDER CONSTRUCTION */
  constructor(req) {
    super();
    this.elementtype = `document`;
    this.table = `document`;

    this.idGroup = (typeof req.session.idGroup  !== `undefined` ? req.session.idGroup  : undefined);
    this.idUser = null;
    this.idDocument = (typeof req.params.idDocument       !== `undefined` ? req.session.idDocument      : undefined);
  }

  async getSections() {
    const sec = new Section();
    return sec.query(`SELECT *`, `iddocument = ${this.idDocument}`)
      .then((result) => result)
      .catch((error) => error);
  }

  /* UNDER CONSTRUCTION */
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

  /* UNDER CONSTRUCTION */
  async getKeywordsForEvaluation() {
    this.table = `document_keywords`;
    return this.query(`SELECT *`, `idevaluations = "${this.idDocument}"`)
      .then((result) => result)
      .catch((error) => error);
  }
}


module.exports = {
  Document,
};
