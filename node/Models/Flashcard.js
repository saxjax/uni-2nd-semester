/* eslint no-console: 0 */

const { Model }   = require(`./AbstractClasses/Model`);


/* Flashcard er den klasse der består af et concept og en definition
 * Sammen med QuizQuestion er de pt. de primære evalueringselementer i en Evaluation.
 * TODO: Future works: Flashcard er ikke implementeret pt.
 */

class Flashcard extends Model {
  /* Alle flashcardType/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super();
    this.elementType = `${this.flashcardType}`;
    this.table = `${this.flashcardTable}`;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `${this.flashcardCol}`;
          this.idQuery = req.params.idQuery;
          break;
        case `POST`:
          this.concept    = req.body.concept;
          this.definition = req.body.definition;
          break;
        default: console.warn(`Metode ikke oprettet?`); break;
      }
    }
  }

  /* Formål: At kunne oprette den givne model i databasen ud fra posted data fra en form.
             Der bliver desuden automatisk oprettet de forskellige dependencies/foreign keys som objektet tilhører.
   * Input : Et objekt oprettet med et request med postdata i body samt user/group data i session
   * Output: True hvis queren inserter, ellers false hvis der sker en fejl.
   */
  async insertToDatabase() {
    // TODO: Future works: Gør ligesom QuizQuestion
  }
}
module.exports = {
  Flashcard,
};
