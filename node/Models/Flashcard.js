/* eslint no-console: 0 */

const { Evaluation } = require(`./AbstractClasses/Evaluation.js`);

/* UNDER CONSTRUCTION */

class Flashcard extends Evaluation {
  constructor(req) {
    super();
    this.elementType = `flashcard`;
    this.table = `flashcard`;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      // this.idDocument?
      // this.idSection?
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `ID_FLASHCARD`;
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
    try {
      await this.query(`ID_USER_GROUP = "${this.idGroup}" `
                 + `AND ID_USER = "${this.idUser}" `
                 + `AND ID_DOCUMENT = "${this.idDocument}" `
                 + `AND ID_DOCUMENT_SECTION = "${this.idSection}" `
                 + `AND CONCEPT = "${this.concept}" `
                 + `AND DEFINITION = "${this.definition}"`);
    }
    catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
}
module.exports = {
  Flashcard,
};
