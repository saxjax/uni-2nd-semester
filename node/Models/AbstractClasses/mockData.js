const { Model } = require(`./AbstractClasses/Model.js`);
/* Ideen med denne class er at den skal have funktioner til at oprette
mockdata i databasen */
/* IKKE FÆRDIG DU MÅ GERNE TILFØJE mockdata-FUNKTIONER SOM DU SAVNER */
class MockData extends Model {
  constructor(req) {
    super();
    this.elementtype = ``;
    this.table = ``;
    this.allElemenTypes = [`group`, `user`, `document`, `section`, `quiz`, `quiz_question`, `quiz_result`, `flashcard`, `flashcard_result`];
    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      switch (req.method) {
        case `GET`: case `DELETE`:
          this.idColumnName = `ID_FLASHCARD`;
          this.idQuery = req.params.idQuery;
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
    this.allElemenTypes.forEach((element) => {
      console.log(element);
    });
  }
}
module.exports = {
  MockData,
};
