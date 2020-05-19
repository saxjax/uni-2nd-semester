/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

/* FIXME: UNDER CONSTRUCTION */

class ProgressBar extends Model {
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
          this.idColumnName = `ID_USER`;
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
    let totalEvaluationsForGroup = await this.query(`CUSTOM`, `SELECT COUNT(*) as TOTAL
                                                        FROM evaluation e
                                                        WHERE e.ID_DOCUMENT IN (SELECT ID_DOCUMENT FROM document WHERE ID_USER_GROUP = "${this.idGroup}");`);
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
      progress.totalCorrectProgress = progress.totalProgress.toFixed(2) * 100; // Round to 2 decimals and multiply by 100 to get percentage.
    }
    return progress;
  }
}


module.exports = {
  ProgressBar,
};


// -- Totalt Evalueringer for en gruppe.
// SELECT COUNT(*)
// FROM evaluation e
// WHERE e.ID_DOCUMENT IN (SELECT ID_DOCUMENT FROM document WHERE ID_USER_GROUP = "34701dd1-7c29-11ea-86e2-2c4d54532c7a");
//
// -- Gennemførte Evalueringer for en bruger.
// SELECT DISTINCT(qr.ID_EVALUATION) FROM quiz_result qr
// INNER JOIN evaluation e ON qr.ID_EVALUATION = e.ID_EVALUATION
// WHERE e.ID_DOCUMENT IN (SELECT ID_DOCUMENT from document WHERE ID_USER_GROUP = "34701dd1-7c29-11ea-86e2-2c4d54532c7a")
// AND qr.ID_USER = "553e422d-7c29-11ea-86e2-2c4d54532c7a";
//
// -- Correct gennemførte evalueringer for en bruger.
// SELECT DISTINCT(qr.ID_EVALUATION) FROM quiz_result qr
// INNER JOIN evaluation e ON qr.ID_EVALUATION = e.ID_EVALUATION
// WHERE e.ID_DOCUMENT IN (SELECT ID_DOCUMENT FROM document WHERE ID_USER_GROUP = "34701dd1-7c29-11ea-86e2-2c4d54532c7a")
// AND qr.POINT = qr.TOTAL
// AND qr.ID_USER = "553e422d-7c29-11ea-86e2-2c4d54532c7a";
