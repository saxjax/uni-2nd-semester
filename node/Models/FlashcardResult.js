/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model`);

/* UNDER CONSTRUCTION! Alt i denne fil er alene for test_purposes og intet andet som det står nu. */

class FlashcardResult extends Model {
  constructor(req) {
    super(req);
    this.elementType = `flashcard_result`;
    this.table = `flashcard_result`;
    this.idDocument = `11111111-aaaa-bbbb-1111-111111111111`; // Hardcoded into every section - can be changed in the future

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName   = `ID_FLASHCARD_RESULT`;
          this.idQuery        =  req.params.idQuery;
          break;
        case `POST`:
          this.idEvaluation  = req.body.idEvaluation;
          this.points  = req.body.score.points;
          this.total = req.body.score.total;
          this.questionArray = req.body.questionsArray;
          break;
        case `TEST`:
          this.elementType = `flashcardResult`;
          this.table = `flashcard_result`;
          break;
        default: break;
      }
    }
  }
}

module.exports = {
  FlashcardResult,
};
