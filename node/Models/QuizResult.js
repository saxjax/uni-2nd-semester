/* eslint no-console: off */

const { SpacedRepetition } = require(`./SpacedRepetition`);
const { ParseSql } = require(`./AbstractClasses/ParseSQL`);

/* QuizResult er den klasse som holder styr på de resultater som en bruger har til et specifikt QuizQuestion
 * QuizResult nedarver fra SpacedRepetition, da den indeholder nogle hjælpefunktioner til at sikre spaced repetition
 * QuizResult er QuizQuestions anden halvdel, som gør spørgsmålene brugbare, og som tilkobler en User med et bestemt forsøg på et QuizQuestion
 */

class QuizResult extends SpacedRepetition {
  /* Alle quizResultType/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super(req);
    this.elementType = `${this.quizResultType}`;
    this.table = `${this.quizResultTable}`;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      this.reqBody = req.body;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          // DET HER ER HARDCODED OG GÅR UDEN OM PARSEREN IKKE GODT!!!!!!!
          this.idColumnName   = `${this.attemptCol}`;
          this.idQuery        =  req.params.idAttempt;
          this.idEvaluationCol = `${this.evaluationCol}`;
          this.idEvaluation = req.params.idQuery;
          break;
        case `POST`:
          this.idEvaluation  = req.body.idEvaluation;
          this.points  = req.body.score.points;
          this.total = req.body.score.total;
          this.questionArray = req.body.questionsArray;
          break;
        default: break;
      }
    }
  }

  /* Formål: At kunne oprette den givne model i databasen ud fra posted data fra en form.
             Der bliver desuden automatisk oprettet de forskellige dependencies/foreign keys som objektet tilhører.
   * Input : Et objekt oprettet med et request med postdata i body samt user/group data i session
   * Output: UUID'et som er blevet oprettet i databasen.
   */
  async insertToDatabase() {
    const UUID = await this.getUuid();
    const string = await this.makeInsertString(UUID);
    this.query(`CUSTOM`, `INSERT INTO ${this.quizResultTable} `
                       + `(${this.groupCol}, ${this.userCol}, ${this.evaluationCol}, ${this.quizQuestionCol}, ${this.attemptCol}, ${this.QRPointCol}, ${this.QRTotalCol}, ${this.QRResultCol}, ${this.QRUserAnswerCol}) `
                       + `VALUES ${string}`);
    return UUID;
  }

  /* Formål: At oprette den streng af forskellige resultater som en bruger har svaret på.
   *            Ved at oprette hele strengen i et gò reduceres mængden af nødvendige SQL kald til MySQL databasen
   * Input : @UUID som er det idAttempt der tillægges alle de svar en bruger har taget
   * Output: En streng med alle de QuizResults der skal oprettes, hvor det sidste "," er slicet fra
   */
  makeInsertString(UUID) {
    let string = ``;
    this.questionArray.forEach((question) => {
      string += `("${this.idGroup}", `
               + `"${this.idUser}", `
               + `"${question.idEvaluation}", `
               + `"${question.idQuestion}", `
               + `"${UUID}", `
               + `"${this.points}", `
               + `"${this.total}", `
               + `"${question.correctAnswerGiven}", `
               + `"${question.userAnswers}"),`;
    });

    return string.slice(0, -1);
  }

  /* Formål: Henter alle de QuizResults som findes i det objekt der kalder denne funktion
   * Input : Ingen, men modificere this.tabel hen til quiz_result og tilbage igen
   * Output: Et promise der resolver til en datapakke med alle QuizResults der er tilgængeligt i en øvre klasse
   */
  async getAllQuizQuestionResults() {
    const trueTable = this.table;

    let string = ``;
    const idQuestions = await this.query(`SELECT ${this.quizQuestionCol}`, `${this.attemptCol} = "${this.idQuery}"`);
    string = this.createQueryString(idQuestions);
    this.table = `${this.quizQuestionTable}`;
    const queryResult = await this.query(`SELECT *`, `${string}`);
    this.table = trueTable;

    return queryResult;
  }

  /* Formål: At lave den querystring som skal bruges til at hente alle QuizResults
   * Input : @idQuizQuestions er det id tilhørende en specifik QuizQuestion, som resultaterne henviser til
   * Output: En streng der søger efter alle de rows, hvor alle de forskellige QuizQuestions er.
   */
  createQueryString(idQuizQuestions) {
    let string = ``;
    idQuizQuestions.forEach((element, index) => {
      if (index > 0) {
        string += ` OR `;
      }
      string += `${this.quizQuestionCol} = "${element.idQuizQuestion}"`;
    });
    string += ` ;`;
    return string;
  }

  /* Formål: At kunne hente historisk quiz data ud fra et forsøgsID samt beregne næste repetationsdato
   * Input : forsøgsID og QuestionData
   * Output: Object med historisk quiz data for de omhandlede input quizzer.
   */
  async getHistoricQuizResultData(idAttempt, reqBodyQuestionArray) {
    let stringforSQL = ``;

    // Lav en string til SQL så vi kan sortere udelukkende på de pågældende quizzer
    const questionsArray = reqBodyQuestionArray.map((question) => question.idQuestion);
    questionsArray.forEach((id) => {
      stringforSQL += `"${id}",`;
    });
    stringforSQL = stringforSQL.slice(0, -1); // Fjerner det sidste komma

    // Hent historisk data omkring quizzerne for den pågældende bruger
    const resultData = await this.query(`CUSTOM`, `SELECT QR1.${this.evaluationCol}, `
                                               + `QR1.${this.quizQuestionCol}, `
                                               + `QR1.${this.userCol}, `
                                               + `(SELECT QR2.${this.QRResultCol} FROM ${this.quizResultTable} QR2 `
                                               + `WHERE QR1.${this.quizQuestionCol} = QR2.${this.quizQuestionCol} AND QR1.${this.userCol} = QR2.${this.userCol} `
                                               + `ORDER BY QR2.${this.QRCreatedDateCol} DESC limit 1 ) as RECENT_RESULT, `
                                               + `max(QR1.${this.QRCreatedDateCol})  as RECENT_ATTEMPT_DATE, `
                                               + `"-----"  as NEXT_REPITITION, `
                                               + `COUNT(QR1.${this.QRResultCol}) as TOTAL, `
                                               + `sum(case when QR1.${this.QRResultCol} = 'false' then 1 else 0 end) AS FAILED_ATTEMPTS, `
                                               + `sum(case when QR1.${this.QRResultCol} = 'true' then 1 else 0 end) AS SUCESS_ATTEMPTS `
                                               + `FROM p2.${this.quizResultTable} QR1 `
                                               + `WHERE QR1.${this.userCol} = "${this.idUser}" AND QR1.${this.quizQuestionCol} in (${stringforSQL}) `
                                               + `GROUP BY QR1.${this.userCol},QR1.${this.quizQuestionCol};`);
    // Hent data omkring de sidste quiz forsøg for den pågældende bruger.
    // KAN FORMENTLIG SLETTES, DA OVENSTÅENDE QUERY HAR DENNE INFORMATION ALLEREDE.
    const recentAttempt = await this.query(`CUSTOM`, `SELECT ${this.quizQuestionCol},${this.QRResultCol},${this.QRCreatedDateCol} 
                                         FROM ${this.quizResultTable} WHERE ${this.attemptCol} = "${idAttempt}"
                                         ORDER BY ${this.QRCreatedDateCol} DESC`);
    const Parser = new ParseSql();
    const parsedResultData = Parser.parseQuizResultsForSpacedRepetition(resultData);
    parsedResultData.forEach((quizResult) => {
      quizResult.nextRepetition = this.calculateNextRepetitionTimeStampForEvaluation(quizResult); // eslint-disable-line no-param-reassign
    });

    return { resultData: parsedResultData, recentAttempt };
  }
}

module.exports = {
  QuizResult,
};
