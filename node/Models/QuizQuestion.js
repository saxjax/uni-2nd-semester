/* eslint no-console: off */

const { Model }   = require(`./AbstractClasses/Model`);
const { Keyword } = require(`./keyword.js`);

/* QuizQuestion er et spørgsmål/svarmuligheder par der kan oprettes i en Evaluation
 * QuizQuestion holder styr på svarene og spørgsmålene, og bruges sammen med QuizResult til at en bruger kan tage quizzen
 * Siden QuizQuestion får sine klasser i grupper fra en frontend post, så har den nogle specielle funktioner til
 *   at håndtere oprettelsen af flere QuizQuestion på en gang.
 */
class QuizQuestion extends Model {
  /* Alle quizQuestionType/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super();
    this.elementType = `${this.quizQuestionType}`;
    this.table = `${this.quizQuestionTable}`;
    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      this.req = req;
      switch (req.method) {
        case `GET`: case `DELETE`: case `UPDATE`:
          this.idColumnName = `${this.quizQuestionCol}`;
          this.idQuery = req.params.idQuery;
          this.loggedIn = req.session.loggedIn;
          break;
        case `POST`:
          this.idEvaluation = req.body[0].idEvaluation;
          this.questions = req.body;
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
    const docAndSecID = await this.getDocumentAndSectionID();
    const promiseArray = [];
    const AllQuizQuestionUUIDs = await this.getQuizQuestionUUID(this.questions.length); // får alle UUIDs fra databasen som skal benyttes, i ét database kald.
    for (let i = 0; i < this.questions.length; i++) {
      const insertQuestionQuery = this.insertQuestionToDatabase(this.questions[i], AllQuizQuestionUUIDs[i].UUID);
      promiseArray.push(insertQuestionQuery);
      const insertKeywordsQuery = this.insertKeywordQuizQuestion(this.questions[i], AllQuizQuestionUUIDs[i].UUID, docAndSecID);
      promiseArray.push(insertKeywordsQuery);
    }
    await Promise.all(promiseArray);
  }

  /* Formål: At indsætte et nyt quiz question i databasen
   * Input : et question-objekt, som indeholder de fire ting, som man kan se i query()
   * Output: Et promise, som kommer fra query()
   */
  async insertQuestionToDatabase(question, UUID) {
    return this.query(`INSERT`, `${this.evaluationCol} = "${question.idEvaluation}" `
        + `AND ${this.quizQuestionCol} = "${UUID}" `
        + `AND ${this.QQQuestionCol} = "${question.question}" `
        + `AND ${this.QQCorrectnessCol} = "${question.correctAnswers.join(`;`)}" `
        + `AND ${this.QQKeywordsCol} = "${question.keyword.join(`;`)}" `
        + `AND ${this.groupCol} = "${this.idGroup}" `
        + `AND ${this.QQAnswersCol} = "${question.answers.join(`;`)}"`);
  }

  async getQuizQuestionUUID(uuidAmount) {
    const selectString = this.generateSelectString(uuidAmount);
    return this.query(`CUSTOM`, `${selectString}`);
  }

  async getDocumentAndSectionID() {
    const select = await this.query(`CUSTOM`, `SELECT ${this.documentCol} as idDocument ,${this.sectionCol} as idSection FROM ${this.evaluationTable} WHERE ${this.evaluationCol} = "${this.idEvaluation}"`);
    return select[0];
  }

  async insertKeywordQuizQuestion(question, questionUUID, docAndSecID) {
    if (question.keyword !== []) { // If the user put any keywords they get inserted
      const insertKeyword = new Keyword(this.req);
      const idObject = {
        idDocument: `${docAndSecID.idDocument}`,
        idSection: `${docAndSecID.idSection}`,
        idEvaluation: `${question.idEvaluation}`,
        idQuizQuestion: `${questionUUID}`,
      };
      await insertKeyword.insertToDatabase(idObject, question.keyword);
    }
  }

  generateSelectString(uuidAmount) {
    let string = ``;
    for (let i = uuidAmount; i > 0; i--) {
      string += `SELECT UUID() as UUID UNION `;
    }
    string = string.slice(0, -6);
    return string;
  }
}
module.exports = {
  QuizQuestion,
};
