const { Evaluation } = require(`../Evaluation/Evaluation.js`);

class Quiz extends Evaluation {
  /* Input : requestet der sendes fra en klient, samt inheritance af Database objektet.
   * Output: Et objekt med unikt ID konstrueret med de givne variable tilknyttet det.
   * Udvidet Beskrivelse:
   * Variablene over mellemrummet inheriter og overskriver JS database modulet.
   * Elementtype er en kolonne i databasen der angiver type, mens table angiver tabellen.
   * Variablene under mellemrummet har navn efter tabelens SQL database kolonner.
   * groupId variablen hentes fra cookies, da de altid skal være tilgængelige.
   * Værdier sat til null er de parent ID'er som objektet har i sig, der endnu ikke har en funktion.
   * idQuiz variablen hentes fra parametrene, da den sendes med en GET/SELECT request
   * Andre variable hentes fra body, da de sendes med en POST/INSERT eller PUT/UPDATE request
   */
  constructor(req) {
    super();
    this.elementtype = `quiz`;
    this.table = `quiz`;

    this.idGroup = (typeof req.session.idGroup  !== `undefined` ? req.session.idGroup  : undefined);
    this.idUser = null;
    this.idQuiz = (typeof req.params.idQuiz       !== `undefined` ? req.session.idQuiz      : undefined);
    this.question = `Not set`;
    this.answer = [];
    // correctness er en binær repræsentation af svarernes sandhadsværdi "0001" betyder at answers[3] i er korrekt de andre er false!
    this.correctness = `0000`;
  }

  // Formål: Hent quiz_question indhold for det pågældende idquiz
  // Input : this.idQuiz fra constructoren
  // Output: Array indeholdende et antal quizQuestion elementer
  async getQuiz() {
    this.table = `quiz_question`;
    return this.query(`SELECT *`, `idquiz = "${this.idQuiz}"`)
      .then((result) => result)
      .catch((error) => error);
  }
}
module.exports = {
  Quiz,
};
