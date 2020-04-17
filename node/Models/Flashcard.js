const { Evaluation } = require(`./AbstractClasses/Evaluation.js`);

/* UNDER CONSTRUCTION */

class Flashcard extends Evaluation {
  constructor(req) {
    super();
    this.elementtype = `flashcard`;
    this.table = `flashcard`;

    if (this.validateMethodChoice(req)) {
      this.groupId = req.session.groupId;
      this.userId  = req.session.userId;
      switch (req.method) {
        case `GET`: case `DELETE`:
          this.idColumnName = `ID_FLASHCARD`;
          this.queryId = req.params.queryId;
          break;
        case `POST`: case `UPDATE`:
          this.concept    = req.body.concept;
          this.definition = req.body.definition;
          break;
        default: console.warn(`Metode ikke oprettet?`); break;
      }
    }
  }
}
module.exports = {
  Flashcard,
};
