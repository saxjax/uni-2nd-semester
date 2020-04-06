const { Database } = require(`../Database/Database.js`);

class Evaluation extends Database {
  constructor(request) {
    super();
    this.name = `Evaluation`;
    this.table = `quiz`;
    this.request = request;
    this.iddocument = `Not set`;
    this.elementtype = `Not set`;
    this.title = `Not set`;
  }

  // reset to default parameters
  reset() {
    this.name = `Evaluation`;
    this.table = `quiz`;
    this.iddocument = `Not set`;
    this.elementtype = `Not set`;
    this.title = `Not set`;
  }

  // Henter alle evalueringer i this.table på databasen
  // input: non
  // output: array af samtlige tilgængelige elementer i den pågældende table.
  async getAllEvaluations() {
    // console.log(`prøver at hente : `+ id);
    return this.query(`SELECT *`)
      .then((result) => result)
      .catch((error) => error);
  }


  // Henter alle evalueringer i this.table som er tilknyttet det pågældende iddocument_section
  // på databasen
  // input: iddocument_section
  // output: array af samtlige tilgængelige elementer i den pågældende table som er
  //         knyttet til iddocument_section
  async getEvalForSection(id) {
    return this.query(`SELECT *`, `iddocument_section = "${id}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  // hent quiz_question indhold for det pågældende idquiz
  // input: idquiz
  // output: array indeholdende et antal quiz_question elementer
  async getQuiz(id) {
    this.table = `quiz_question`;
    return this.query(`SELECT *`, `idquiz = "${id}"`)
      .then((result) => result).then(this.reset())
      .catch((error) => error);
  }

  // virker ikke!!
  // hent flashcard indhold for det pågældende idflashcard
  // input: idflashcard
  // output: array med 1 element indeholdende et flashcard
  async getFlashcard(id) {
    return this.query(`SELECT *`, `idflashcard = "${id}"`)
      .then((result) => result).then(this.reset())
      .catch((error) => error);
  }

  // async getKeywordsForSection(id) {
  //   // console.log(`prøver at hente : ` + id);
  //   this.table = `document_keywords`;
  //   return this.query(`SELECT *`, `iddocument = "${id}"`)
  //     .then((result) => result)
  //     .catch((error) => error);
  // }
}


module.exports = {
  Evaluation,
};
