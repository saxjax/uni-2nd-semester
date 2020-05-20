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
          this.idDocument = undefined;
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
    this.idEvaluation = await this.getUuid();
    this.idDocument = this.getDocId();
    await this.query(`INSERT`, `ID_DOCUMENT = "${this.idDocument}" AND `
                               + `ID_DOCUMENT_SECTION = "${this.idSection}" AND `
                               + `ID_EVALUATION = "${this.idEvaluation}" AND`
                               + `ID_USER = "${this.idUser}" AND `
                               + `ID_USER_GROUP = "${this.idGroup}" AND `
                               + `EVALUATION_TITLE = "${this.title}" AND `);

    const keyw = new Keyword(this.req);
    const idObject = {
      idDocument: `${this.idDocument}`,
      idSection: `${this.idSection}`,
      idEvaluation: `${this.idEvaluation}`,
      idEvaluationQuestion: ``,
    };
    await keyw.insertToDatabase(idObject, this.keywords);
    return this.idEvaluation;
  }

  async getDocId() {
    this.table = `document_section`;
    const idDocumentArr = await this.query(`SELECT`, `ID_DOCUMENT_SECTION = "${this.idSection}"`);
    this.table = `evaluation`;
    return idDocumentArr[0].idDocument;
  }

  // FIXME:denne funktion findes allerede getAllElementsOftype(`quiz_question`)
  /* Bliver brugt i viewControlleren i funktionen viewEvaluationPage
  Bruges til at hente alle spørgsmålene til den pågældende evaluering
  */
  async getAllQuizQuestions() {
    this.table = `quiz_question`;
    let queryResult;
    try {
      queryResult = await this.query(`SELECT *`, `${this.idColumnName} = "${this.idQuery}"`);
    }
    catch (error) {
      console.log(error);
    }
    this.table = `evaluation`;
    return queryResult;
  }
}
module.exports = {
  Evaluation,
};
