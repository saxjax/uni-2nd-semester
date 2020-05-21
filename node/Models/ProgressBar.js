/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

/* FIXME: UNDER CONSTRUCTION */

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

  async getProgressFromDB() {
    const progress = { totalProgress: 0, totalCorrectProgress: 0 };
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
    return progress;
  }

  // Retrives the evaluations that the user has not yet taken for display on the homepage
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
