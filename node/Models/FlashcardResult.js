/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model`);

/* FlashcardResult er den klasse der holder styr på hvilke resultater brugerne har fået ved brugen af et flashcard
 * Den holder dermed styr på hver eneste gang en bruger tager et specifikt flashcard.
 * TODO: Er pt. ikke implementeret
 */

class FlashcardResult extends Model {
  /* Alle flashcardResultType/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super(req);
    this.elementType = `${this.flashcardResultType}`;
    this.table = `${this.flashcardResultTable}`;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName   = `${this.flashcardResultCol}`;
          this.idQuery        =  req.params.idQuery;
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
}

module.exports = {
  FlashcardResult,
};
