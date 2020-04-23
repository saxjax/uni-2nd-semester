const { Evaluation } = require(`./AbstractClasses/Evaluation.js`);

class Quiz extends Evaluation {
  constructor(req) {
    super(req);
    this.elementType = `quiz`;
    this.table = `quiz`;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `ID_QUIZ`;
          this.idQuery = req.params.idQuery;
          break;
        case `POST`:
          // none yet
          break;
        case `TEST`:
          this.elementType = `quiz`;
          this.idQuiz = undefined;
          this.idDocument = undefined;
          this.idDocumentSection = undefined;
          this.title = undefined;
          this.keywords = undefined;
          break;
        default: break;
      }
    }
  }
}
module.exports = {
  Quiz,
};
