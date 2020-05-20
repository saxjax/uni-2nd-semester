/* eslint no-console: off */

const { SpacedRepetition } = require(`./spacedRepetition`);

class QuizResult extends SpacedRepetition {
  constructor(req) {
    super(req);
    this.elementType = `quiz_result`;
    this.table = `quiz_result`;
    this.idDocument = `11111111-aaaa-bbbb-1111-111111111111`; // Hardcoded into every section - can be changed in the future

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      this.reqBody = req.body;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          // DET HER ER HARDCODED OG GÅR UDEN OM PARSEREN IKKE GODT!!!!!!!
          this.idColumnName   = `ID_ATTEMPT`;
          this.idQuery        =  req.params.idAttempt;
          this.idEvaluationCol = `ID_EVALUATION`;
          this.idEvaluation = req.params.idQuery;
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
    this.query(`CUSTOM`, `INSERT INTO quiz_result (ID_USER_GROUP, ID_USER, ID_EVALUATION, ID_QUIZ_QUESTION, ID_ATTEMPT, POINT, TOTAL, RESULT, USER_ANSWER) VALUES ${string}`);
    return uuid[0].UUID;
  }

  async makeInsertString(uuid) {
    let string = ``;
    this.questionArray.forEach((question) => {
      string += `("${this.idGroup}","${this.idUser}", "${question.idEvaluation}", "${question.idQuestion}", "${uuid[0].UUID}", "${this.points}", "${this.total}", "${question.correctAnswerGiven}", "${question.userAnswers}"),`;
    });

    return string.slice(0, -1);
  }

  async getUuid() {
    const result = await this.query(`CUSTOM`, `SELECT UUID() AS UUID`);
    return result;
  }

  async getAllQuizQuestions() {
    const trueTable = this.table;
    let queryResult;

    let string = ``;
    const idQuestions = await this.query(`SELECT ID_QUIZ_QUESTION`, `ID_ATTEMPT = "${this.idQuery}"`);
    string = this.createQueryString(idQuestions);
    this.table = `quiz_question`;
    try {
      queryResult = await this.query(`SELECT *`, `${string}`);
    }
    catch (error) {
      console.log(error);
    }
    this.table = trueTable;
    return queryResult;
  }

  createQueryString(idQuizQuestions) {
    let string = ``;
    idQuizQuestions.forEach((element, index) => {
      if (index > 0) {
        string += ` OR `;
      }
      string += `ID_QUIZ_QUESTION = "${element.idQuizQuestion}"`;
    });
    string += ` ;`;
    return string;
  }

  /* Formål: At kunne hente historisk quiz data ud fra et forsøgsID.
   * Input : forsøgsID og QuestionData
   * Output: Object med historisk quiz data for de omhandlede input quizzer.
   */
  async getHistoricQuizResultData(idAttempt, reqBodyQuestionArray) {
    let resultData;
    let recentAttempt;
    let stringforSQL = ``;

    // Lav en string til SQL så vi kan sortere udelukkende på de pågældende quizzer
    const questionsArray = reqBodyQuestionArray.map((question) => question.idQuestion);
    questionsArray.forEach((id) => {
      stringforSQL += `"${id}",`;
    });

    stringforSQL = stringforSQL.slice(0, -1);

    // Hent historisk data omkring quizzerne for den pågældende bruger
    try {
      resultData = await this.query(`CUSTOM`, `SELECT QR1.ID_EVALUATION,
                                               QR1.ID_QUIZ_QUESTION,
                                               QR1.ID_USER,
                                               (SELECT QR2.RESULT FROM quiz_result QR2 WHERE QR1.ID_QUIZ_QUESTION = QR2.ID_QUIZ_QUESTION AND QR1.ID_USER = QR2.ID_USER ORDER BY QR2.CREATED_DATE DESC limit 1 ) as RECENT_RESULT,
                                               max(QR1.CREATED_DATE)  as RECENT_ATTEMPT_DATE,
                                               "-----"  as NEXT_REPITITION,
                                               COUNT(QR1.RESULT) as TOTAL,
                                               sum(case when QR1.RESULT = 'false' then 1 else 0 end) AS FAILED_ATTEMPTS,
                                               sum(case when QR1.RESULT = 'true' then 1 else 0 end) AS SUCESS_ATTEMPTS
                                               FROM p2.quiz_result QR1
                                               WHERE QR1.ID_USER = "${this.idUser}" AND QR1.ID_QUIZ_QUESTION in (${stringforSQL})
                                               GROUP BY QR1.ID_USER,QR1.ID_QUIZ_QUESTION;`);
    }
    catch (error) {
      console.log(error);
    }

    // Hent data omkring de sidste quiz forsøg for den pågældende bruger.
    // KAN FORMENTLIG SLETTES, DA OVENSTÅENDE QUERY HAR DENNE INFORMATION ALLEREDE.
    try {
      recentAttempt = await this.query(`CUSTOM`, `SELECT ID_QUIZ_QUESTION,RESULT,CREATED_DATE 
                                         FROM quiz_result WHERE ID_ATTEMPT = "${idAttempt}"
                                         ORDER BY CREATED_DATE DESC`);
    }
    catch (error) {
      console.log(error);
    }

    const result = { resultData, recentAttempt };
    return result;
  }
}

module.exports = {
  QuizResult,
};
