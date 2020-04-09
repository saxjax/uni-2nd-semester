/* eslint no-console: off */

const { Database } = require(`../Database/Database`);
const { Flashcard } = require(`../Evaluation/Flashcard`);
const { Quiz } = require(`../Evaluation/Quiz`);

/* UNDER CONSTRUCTION */

class Group extends Database {
  /* Input : requestet der sendes fra en klient, samt inheritance af Database objektet.
   * Output: Et objekt med unikt ID konstrueret med de givne variable tilknyttet det.
   * Udvidet Beskrivelse:
   * Variablene over mellemrummet inheriter og overskriver JS database modulet.
   * Elementtype er en kolonne i databasen der angiver type, mens table angiver tabellen.
   * Variablene under mellemrummet har navn efter tabelens SQL database kolonner.
   * Group er det øverste objekt i programmet, og har dermed ingen parents i sig.
   * idGroup variablen hentes fra parametrene, da den sendes med en GET/SELECT request
   * Andre variable hentes fra body, da de sendes med en POST/INSERT eller PUT/UPDATE request
   */
  constructor(req) {
    super();
    this.elementtype = `group`;
    this.idColumnName = `iduser_group`;
    this.table = `group`;

    this.idGroup = (typeof req.params.idGroup       !== `undefined` ? req.session.idGroup      : undefined);
  }

  /* Input : En Group er blevet oprettet med et unikt iduser_group
   * Output: Returnere alle flashcard data som er tilknyttet den givne gruppe.
   * Formål: At kunne få alle flashcard data tilhørende sectionen.
   */
  async getAllFlashcards() {
    const flash = new Flashcard();
    return flash.query(`SELECT *`, `iddocument_section = "${this.idGroup}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  /* Input : En Group er blevet oprettet med et unikt iduser_group
   * Output: Returnere alle quiz data som er tilknyttet den givne gruppe.
   * Formål: At kunne få alle quiz data tilhørende sectionen.
   */
  async getAllQuizzes() {
    const q = new Quiz();
    return q.query(`SELECT *`, `iddocument_section = "${this.idGroup}"`)
      .then((result) => result)
      .catch((error) => error);
  }
}

module.exports = {
  Group,
};
