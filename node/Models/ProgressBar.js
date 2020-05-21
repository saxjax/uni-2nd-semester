/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

/* FIXME: UNDER CONSTRUCTION */

class ProgressBar extends Model {
  /* Alle "modelnavn"Type/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super(req);
    this.elementType = `quiz_result`;
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
                                                        WHERE e.ID_DOCUMENT IN (SELECT ID_DOCUMENT FROM document WHERE ${this.groupCol} = "${this.idGroup}");`);
    totalEvaluationsForGroup = totalEvaluationsForGroup[0].TOTAL;

    // Get how many evaluations a specific user has taken.
    let EvaluationsForUser = await this.query(`CUSTOM`, `SELECT COUNT(DISTINCT(qr.ID_EVALUATION)) as UserTotal 
                                                              FROM quiz_result qr
                                                              INNER JOIN evaluation e ON qr.ID_EVALUATION = e.ID_EVALUATION
                                                              WHERE e.ID_DOCUMENT IN (SELECT ID_DOCUMENT from document WHERE ID_USER_GROUP = "${this.idGroup}")
                                                              AND qr.ID_USER = "${this.idUser}"`);
    if (EvaluationsForUser[0].UserTotal > 0) {
      EvaluationsForUser = EvaluationsForUser[0].UserTotal;
      progress.totalProgress = (EvaluationsForUser / totalEvaluationsForGroup);
      progress.totalProgress = progress.totalProgress.toFixed(2) * 100; // Round to 2 decimals and multiply by 100 to get percentage.
    }

    // Get how many evaluations a specific user has taken where all questions are correct.
    let totalCorrectProgressForUser = await this.query(`CUSTOM`, `SELECT COUNT(DISTINCT(qr.ID_EVALUATION)) as TotalCorrect 
                                                                 FROM quiz_result qr
                                                                 INNER JOIN evaluation e ON qr.ID_EVALUATION = e.ID_EVALUATION
                                                                 WHERE e.ID_DOCUMENT IN (SELECT ID_DOCUMENT FROM document WHERE ID_USER_GROUP = "${this.idGroup}")
                                                                 AND qr.POINT = qr.TOTAL
                                                                 AND qr.ID_USER = "${this.idUser}"`);
    if (totalCorrectProgressForUser[0].TotalCorrect > 0) {
      totalCorrectProgressForUser = totalCorrectProgressForUser[0].TotalCorrect;
      progress.totalCorrectProgress = (totalCorrectProgressForUser / totalEvaluationsForGroup);
      progress.totalCorrectProgress = progress.totalCorrectProgress.toFixed(2) * 100; // Round to 2 decimals and multiply by 100 to get percentage.
    }
    return progress;
  }

  // Retrives the evaluations that the user has not yet taken for display on the homepage
  async getEvaluationsNotYetTaken() {
    const evaluationsNotYetTaken = await this.query(`CUSTOM`, `SELECT * FROM evaluation e WHERE e.ID_DOCUMENT IN (SELECT ID_DOCUMENT FROM document WHERE ID_USER_GROUP = "${this.idGroup}") AND e.ID_EVALUATION NOT IN (SELECT DISTINCT(ID_EVALUATION) FROM quiz_result WHERE ID_USER = "${this.idUser}");`);
    return (evaluationsNotYetTaken);
  }
}


module.exports = {
  ProgressBar,
};
