/* eslint no-console: 0 */

const path = require(`path`);

const { Model }   = require(path.join(__dirname, `AbstractClasses`, `Model`));
const { Keyword } = require(path.join(__dirname, `Keyword.js`));

/* Evaluation er klassen der indeholder de quiz, flashcard, mv. som en bruger kan tage
 * Evaluation er primært kun en container som indeholder evalueringselementer, så de er struktureret.
 * Evaluation ligger i en Section, Document og Group.
 */

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
          this.idDocument = `IsInitialisedInInsertToDatabase`;
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

  /* Formål: Da en Evaluation oprettes ud fra en section, så kræves en funktion der henter sectionens documentId
   * Input : None, men gør brug af idSection som set i constructoren kommer fra requestet
   * Output: Det idDocument som idSection er en del af.
   */
  async getDocId() {
    this.table = `${this.sectionTable}`;
    const idDocumentArr = await this.query(`SELECT ${this.documentCol}`, `${this.sectionCol} = "${this.idSection}"`);
    this.table = `${this.evaluationTable}`;
    return idDocumentArr[0].idDocument;
  }
}
module.exports = {
  Evaluation,
};
