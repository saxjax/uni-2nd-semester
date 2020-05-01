/* eslint no-console: 0 */

const { Evaluation } = require(`./AbstractClasses/Evaluation.js`);
const { Keyword }    = require(`./keyword.js`);

class Quiz extends Evaluation {
  constructor(req) {
    super(req);
    this.elementType = `quiz`;
    this.table = `quiz`;
    this.req = req;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      // this.idDocument?
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `ID_QUIZ`;
          this.idQuery = req.params.idQuery;
          break;
        case `POST`:
          this.title = req.body.quizTitle;
          this.idSection = req.body.selectSection;
          this.keywords = req.body.keywords;
          break;
        case `TEST`:
          this.elementType = `quiz`;
          this.idQuiz = undefined;
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
   * Output: Quizzens ID hvis queren inserter, ellers false hvis der sker en fejl.
   */
  async insertToDatabase() {
    let idDocument;
    try {
      idDocument = await this.query(`CUSTOM`, `SELECT ID_DOCUMENT FROM document_section WHERE ID_DOCUMENT_SECTION = "${this.idSection}"`);
    }
    catch (error) {
      console.log(error);
      return false;
    }

    try {
      await this.query(`CUSTOM`, `INSERT INTO ${this.table} (ID_DOCUMENT_SECTION, ID_USER, ID_USER_GROUP, QUIZ_TITLE, ID_DOCUMENT) `
                     + `VALUES ("${this.idSection}","${this.idUser}","${this.idGroup}","${this.title}", `
                     + `"${idDocument[0].ID_DOCUMENT}")`);
    }
    catch (error) {
      console.log(error);
      return false;
    }

    let queryResult = 0;
    try {
      queryResult = await this.query(`SELECT ID_QUIZ`, `QUIZ_TITLE = "${this.title}" `
                       + `AND ID_DOCUMENT_SECTION = "${this.idSection}" `
                       + `AND ID_USER_GROUP = "${this.idGroup}"`);
    }
    catch (error) {
      console.log(error);
      return false;
    }
    const insertkeyword = new Keyword(this.req);
    const idObject = {
      idDocument: `${idDocument[0].ID_DOCUMENT}`,
      idSection: `${this.idSection}}`,
      idQuiz: `${queryResult[0].idQuiz}`,
      idQuizQuestion: ``,
    };
    insertkeyword.insertToDatabase(idObject, this.keywords);

    return queryResult[0].idQuiz;
  }
}
module.exports = {
  Quiz,
};
