/* eslint no-console: 0 */

const { Model }   = require(`./AbstractClasses/Model`);
const { Keyword } = require(`./keyword.js`);

class Evaluation extends Model {
  constructor(req) {
    super(req);
    this.elementType = `evaluation`;
    this.table = `evaluation`;
    this.req = req;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      // this.idDocument?
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `ID_EVALUATION`;
          this.idQuery = req.params.idQuery;
          break;
        case `POST`:
          this.title = req.body.evaluationTitle;
          this.idSection = req.body.selectSection;
          this.keywords = req.body.keywords;
          break;
        case `TEST`:
          this.elementType = `evaluation`;
          this.idEvaluation = undefined;
          this.idDocument = undefined;
          this.idSection = undefined;
          this.title = undefined;
          this.keywords = undefined;
          break;
        default: break;
      }
    }
  }

  /* Formål: At kunne oprette den givne model i databasen ud fra posted data fra en form.
             Der bliver desuden automatisk oprettet de forskellige dependencies/foreign keys som objektet tilhører.
   * Input : Et objekt oprettet med et request med postdata i body samt user/group data i session
   * Output: Evalueringens ID hvis queren inserter, ellers false hvis der sker en fejl.
   */
  async insertToDatabase() {
    console.log(this.req.body);
    try {
      this.idDocument = await this.query(`CUSTOM`, `SELECT ID_DOCUMENT FROM document_section WHERE ID_DOCUMENT_SECTION = "${this.idSection}"`);
    }
    catch (error) {
      console.log(error);
      return false;
    }

    try {
      await this.query(`CUSTOM`, `INSERT INTO ${this.table} (ID_DOCUMENT_SECTION, ID_USER, ID_USER_GROUP, EVALUATION_TITLE, ID_DOCUMENT) `
                     + `VALUES ("${this.idSection}","${this.idUser}","${this.idGroup}","${this.title}", `
                     + `"${this.idDocument[0].ID_DOCUMENT}")`);
    }
    catch (error) {
      console.log(error);
      return false;
    }

    try {
      const queryResult = await this.query(`SELECT ID_EVALUATION`, `EVALUATION_TITLE = "${this.title}" `
                       + `AND ID_DOCUMENT_SECTION = "${this.idSection}" `
                       + `AND ID_USER_GROUP = "${this.idGroup}"`);
      this.idEvaluation = queryResult[0].idEvaluation;
    }
    catch (error) {
      console.log(error);
      return false;
    }
    if (this.req.body.keywords !== []) { // If the user put any keywords they get inserted
      const insertKeyword = new Keyword(this.req);
      const idObject = {
        idDocument: `${this.idDocument[0].ID_DOCUMENT}`,
        idSection: `${this.idSection}}`,
        idEvaluation: `${this.idEvaluation}`,
        idEvaluationQuestion: ``,
      };
      insertKeyword.insertToDatabase(idObject, this.keywords);
    }

    return this.idEvaluation;
  }
}
module.exports = {
  Evaluation,
};
