const { Model } = require(`./AbstractClasses/Model.js`);

class MockData extends Model {
  constructor(req) {
    super();
    this.elementtype = ``;
    this.table = ``;
    this.allElementypes = [`group`, `user`, `document`, `section`, `quiz`, `quiz_question`, `quiz_result`, `flashcard`, `flashcard_result`];
    if (this.validateMethodChoice) {
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

  createMockData() {

  }
}
module.exports = {
  Flashcard,
};
