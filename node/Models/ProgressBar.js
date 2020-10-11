/* eslint no-console: off */

const path = require(`path`);

const { Model } = require(path.join(__dirname, `AbstractClasses`, `Model`));

/* ProgressBar er en hjælperfunktion til quizResult, som sørger for at sende data til frontend når det efterspørges
 * ProgressBar er den bar i programmet, som holder styr på en brugers foreløbige fremskridt med evalueringerne.
 * Progressbar henter og præsentere data til frontend om en specifik brugers resultater, og giver dermed et overblik
 */

class ProgressBar extends Model {
  /* Alle "modelnavn"Type/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super(req);
    this.elementType = `${this.quizResultType}`;
    this.table = ``;
    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `${this.userCol}`;
          this.idQuery       = req.params.idQuery;
          break;
        case `POST`:
          // should not post
          break;
        default: break;
      }
    }
  }

  /* Formål: At få alt den progress som en bruger har i sine evalueringer i et grupperum
   *         Funktionen virker pt. kun på et gruppebasis (men kan udvides til at vise progressen i et dokument/section/evaluation)
   * Input : Intet, men gør brug af idUser og idGroup for at lave de korrekt queries
   * Output: @progress, som er den variabel der indeholder de forskellige typer af progress en bruger kan have.
   *         --  || --  Ses initialiseret øverst i funktionen
   */
  async getProgressFromDB() {
    const progress = {
      totalProgress: 0,
      totalCorrectProgress: 0,
      questionCorrectProgress: 0,
    };
    // Totalt Evalueringer for en gruppe.
    let totalEvaluationsForGroup = await this.query(`CUSTOM`, `SELECT COUNT(*) as TOTAL
                                                        FROM ${this.evaluationTable} e
                                                        WHERE e.${this.documentCol} IN (SELECT ${this.documentCol} FROM ${this.documentTable} WHERE ${this.groupCol} = "${this.idGroup}");`);
    totalEvaluationsForGroup = totalEvaluationsForGroup[0].TOTAL;

    // Get how many evaluations a specific user has taken.
    let EvaluationsForUser = await this.query(`CUSTOM`, `SELECT COUNT(DISTINCT(qr.${this.evaluationCol})) as UserTotal 
                                                              FROM ${this.quizResultTable} qr
                                                              INNER JOIN ${this.evaluationTable} e ON qr.${this.evaluationCol} = e.${this.evaluationCol}
                                                              WHERE e.${this.documentCol} IN (SELECT ${this.documentCol} from document WHERE ${this.groupCol} = "${this.idGroup}")
                                                              AND qr.${this.userCol} = "${this.idUser}"`);
    if (EvaluationsForUser[0].UserTotal > 0) {
      EvaluationsForUser = EvaluationsForUser[0].UserTotal;
      progress.totalProgress = (EvaluationsForUser / totalEvaluationsForGroup) * 100;
    }

    // Get how many evaluations a specific user has taken where all questions are correct.
    let totalCorrectProgressForUser = await this.query(`CUSTOM`, `SELECT COUNT(DISTINCT(qr.${this.evaluationCol})) as TotalCorrect 
                                                                 FROM ${this.quizResultTable} qr
                                                                 INNER JOIN ${this.evaluationTable} e ON qr.${this.evaluationCol} = e.${this.evaluationCol}
                                                                 WHERE e.${this.documentCol} IN (SELECT ${this.documentCol} FROM ${this.documentTable} WHERE ${this.groupCol} = "${this.idGroup}")
                                                                 AND qr.${this.QRPointCol} = qr.${this.QRTotalCol}
                                                                 AND qr.${this.userCol} = "${this.idUser}"`);
    if (totalCorrectProgressForUser[0].TotalCorrect > 0) {
      totalCorrectProgressForUser = totalCorrectProgressForUser[0].TotalCorrect;
      progress.totalCorrectProgress = (totalCorrectProgressForUser / totalEvaluationsForGroup) * 100;
    }

    // Her hentes alle quizQuestions hvor der udregnes hvor mange man har true kontra hvor mange man har false
    this.table = this.quizResultTable;
    const totalTakenQuestionProgressForUser = await this.query(`SELECT ${this.QRResultCol}, ${this.QRCreatedDateCol}, ${this.quizQuestionCol}`, `${this.userCol} = "${this.idUser}" AND ${this.groupCol} = "${this.idGroup}" ORDER BY ${this.QRCreatedDateCol} DESC`);

    // Der indsættes kun de seneste besvarelser i latestUniqueTakenQuestions (dette kan gøres da der laves en ORDER BY createdDate i descending order)
    const latestUniqueTakenQuestions = [];
    totalTakenQuestionProgressForUser.forEach((resultObject) => {
      const duplicateObject = latestUniqueTakenQuestions.find((object) => object.idQuizQuestion === resultObject.idQuizQuestion);
      if (!duplicateObject) {
        latestUniqueTakenQuestions.push(resultObject);
      }
    });

    // Der optælles antal spørgsmål og antal korrekte der udregnes gennemsnit på
    let questionCorrectTaken = 0;
    let questionTotalTaken = 0;
    latestUniqueTakenQuestions.forEach((resultObject) => {
      questionTotalTaken += 1;
      questionCorrectTaken += (resultObject.result === `true` ? 1 : 0);
    });
    progress.questionCorrectProgress = (questionCorrectTaken / questionTotalTaken) * 100;

    return progress;
  }

  /* Formål: Får de evalueringer som endnu ikke er taget af en User der tilgår et grupperum.
   * Input : Ingen, men bruger idUser og idGroup til at query for manglende evalueringer
   * Output: Et Promise der resolver til en database pakke med de endnu ikke tagede evalueringer.
   */
  async getEvaluationsNotYetTaken() {
    const evaluationsNotYetTaken = await this.query(`CUSTOM`, `SELECT * FROM ${this.evaluationTable} e `
                                                  + `WHERE e.${this.documentCol} IN (SELECT ${this.documentCol} FROM ${this.documentTable} `
                                                  + `WHERE ${this.groupCol} = "${this.idGroup}") AND e.${this.evaluationCol} NOT IN (SELECT DISTINCT(${this.evaluationCol}) `
                                                  + `FROM ${this.quizResultTable} WHERE ${this.userCol} = "${this.idUser}");`);
    return (evaluationsNotYetTaken);
  }
}


module.exports = {
  ProgressBar,
};
