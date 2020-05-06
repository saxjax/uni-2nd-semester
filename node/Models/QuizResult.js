/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model`);

class QuizResult extends Model {
  constructor(req) {
    super(req);
    this.elementType = `quiz_result`;
    this.table = `quiz_result`;
    this.idDocument = `11111111-aaaa-bbbb-1111-111111111111`; // Hardcoded into every section - can be changed in the future

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName   = `ID_QUIZ_RESULT`;
          this.idQuery        =  req.params.idQuery;
          break;
        case `POST`:
          this.idEvaluation  = req.body.idEvaluation;
          this.points  = req.body.score.points;
          this.total = req.body.score.total;
          this.questionArray = req.body.questionsArray;
          break;
        case `TEST`:
          this.elementType = `quizResult`;
          this.table = `quiz_result`;
          break;

        default: break;
      }
    }
  }

  /* Formål: At kunne oprette den givne model i databasen ud fra posted data fra en form.
             Der bliver desuden automatisk oprettet de forskellige dependencies/foreign keys som objektet tilhører.
   * Input : Et objekt oprettet med et request med postdata i body samt user/group data i session
   * Output: True hvis queren inserter, ellers false hvis der sker en fejl.
   */
  async insertToDatabase() {
    const uuid = await this.getUuid();
    const string = await this.makeInsertString(uuid);
    this.query(`CUSTOM`, `INSERT INTO quiz_result (ID_USER, ID_EVALUATION, ID_QUIZ_QUESTION, ID_ATTEMPT, POINT, TOTAL, RESULT) VALUES ${string}`);
    return uuid[0].UUID;
  }

  async makeInsertString(uuid) {
    let string = ``;
    this.questionArray.forEach((question) => {
      string += `("${this.idUser}", "${this.idEvaluation}", "${question.idQuestion}", "${uuid[0].UUID}", "${this.points}", "${this.total}", "${question.correctAnswerGiven}"),`;
    });
    return string.slice(0, -1);
  }

  async getUuid() {
    const result = await this.query(`CUSTOM`, `SELECT UUID() AS UUID`);
    return result;
  }
}

module.exports = {
  QuizResult,
};
