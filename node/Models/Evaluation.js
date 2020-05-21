/* eslint no-console: 0 */

const { Model }   = require(`./AbstractClasses/Model`);
const { Keyword } = require(`./keyword.js`);

class Evaluation extends Model {
  /* Alle evaluationType/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super(req);
    this.elementType = `${this.evaluationType}`;
    this.table = `${this.evaluationTable}`;
    this.req = req;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      // this.idDocument?
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `${this.evaluationCol}`;
          this.idQuery = req.params.idQuery;
          break;
        case `POST`:
          this.title = req.body.evaluationTitle;
          this.idSection = req.body.selectSection;
          this.keywords = req.body.keywords;
          this.idDocument = undefined;
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
    this.idDocument = await this.getDocId();
    await this.query(`INSERT`, `${this.documentCol} = "${this.idDocument}" AND `
                               + `${this.sectionCol} = "${this.idSection}" AND `
                               + `${this.evaluationCol} = "${this.idEvaluation}" AND `
                               + `${this.userCol} = "${this.idUser}" AND `
                               + `${this.groupCol} = "${this.idGroup}" AND `
                               + `${this.ETitleCol} = "${this.title}"`);

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
    this.table = `${this.sectionTable}`;
    const idDocumentArr = await this.query(`SELECT ${this.documentCol}`, `${this.sectionCol} = "${this.idSection}"`);
    this.table = `${this.evaluationTable}`;
    return idDocumentArr[0].idDocument;
  }

  // FIXME:denne funktion findes allerede getAllElementsOftype(`quiz_question`)
  /* Bliver brugt i viewControlleren i funktionen viewEvaluationPage
  Bruges til at hente alle spørgsmålene til den pågældende evaluering
  */
  async getAllQuizQuestions() {
    this.table = `${this.quizQuestionTable}`;
    let queryResult;
    try {
      queryResult = await this.query(`SELECT *`, `${this.idColumnName} = "${this.idQuery}"`);
    }
    catch (error) {
      console.log(error);
    }
    this.table = `${this.evaluationTable}`;
    return queryResult;
  }
}
module.exports = {
  Evaluation,
};
