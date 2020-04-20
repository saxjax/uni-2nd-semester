const { Evaluation } = require(`./AbstractClasses/Evaluation.js`);

class Quiz extends Evaluation {
  constructor(req) {
    super();
    this.elementType = `quiz`;
    this.table = `quiz`;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `ID_QUIZ`;
          this.idQuery = req.params.idQuery;
          this.loggedIn = req.session.loggedIn;
          break;
        case `POST`:
          // none yet
          break;
        default: break;
      }
    }
  }
}
module.exports = {
  Quiz,
};
