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

    // insertKeywordQuizQuestion() Skal awaites i loopet, for at undgå at det samme keyword bliver forsøgt indsat flere gange
    for (let i = 0; i < this.questions.length; i++) {
      const insertQuestionQuery = this.insertQuestionToDatabase(this.questions[i], AllQuizQuestionUUIDs[i].UUID);
      promiseArray.push(insertQuestionQuery);
      await this.insertKeywordQuizQuestion(this.questions[i], AllQuizQuestionUUIDs[i].UUID, docAndSecID); // eslint-disable-line no-await-in-loop
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

  /* Formål: At hente alle de UUID som skal bruges til oprettelsen af alle QuizQuestions
   * Input : @uuidAmount er et tal svarende til mængden af QuizQuestions der ønskes oprettet
   * Output: Et promise som resolver til en datapakke med et antal UUID der svarer til @uuidAmount
   */
  async getQuizQuestionUUID(uuidAmount) {
    const selectString = this.generateSelectString(uuidAmount);
    return this.query(`CUSTOM`, `${selectString}`);
  }

  /* Formål: At få fat i Document og Section ID'er fra en evaluation, så QuizQuestion kobles til den overordnede struktur
   * Input : Intet, men bruger idEvaluation til at hente idSection og idDocument
   * Output: Et promise der resolver til det første element i en datapakke der indeholder et objekt med idSection og idDocument
   */
  async getDocumentAndSectionID() {
    const select = await this.query(`CUSTOM`, `SELECT ${this.documentCol} as idDocument ,${this.sectionCol} as idSection FROM ${this.evaluationTable} WHERE ${this.evaluationCol} = "${this.idEvaluation}"`);
    return select[0];
  }

  /* Formål: At indsætte alle de keywords som er tilknyttet hvert eneste question der i gang med at blive oprettet
   * Input : @question som er den data pakke der indeholder nogle keywords
   *         @questionUUID som er det unikke ID der er hentet fra getQuizQuestionUUID
   *         @docAndSecId som er de unikke ID'er der er hentet fra getDocumentAndSectionId
   * Output: Intet, men inserter alle keywords i keyword tabellen.
   */
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

  /* Formål: At hente alle de UUID fra databasen som kan bruges til at oprette en bestemt bunke af QuizQuestion
   * Input : @uuidAmount er et tal svarende til mængden af QuizQuestions der ønskes oprettet
   * Output: En streng af mange forespørgsler for UUID, som bruges i getQuizQuestionUUID
   */
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
