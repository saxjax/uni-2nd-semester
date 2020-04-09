/* eslint no-console: off */

const { Database } = require(`../Database/Database`);
const { Flashcard } = require(`../Evaluation/Flashcard`);
const { Quiz } = require(`../Evaluation/Quiz`);

/* Section er det objekt som indeholder data vedrørende de afsnit der findes i et dokument.
 * UDVID MED INFORMATION NÅR SECTION ER DESIGNET
 */

class Section extends Database {
  /* Input : requestet der sendes fra en klient, samt inheritance af Database objektet.
   * Output: Et objekt med unikt ID konstrueret med de givne variable tilknyttet det.
   * Variablene over mellemrummet inheriter og overskriver JS database modulet.
   * Elementtype er en kolonne i databasen der angiver type, mens table angiver tabellen.
   * Variablene under mellemrummet har navn efter tabelens SQL database kolonner.
   * groupId variablen hentes fra cookies, da de altid skal være tilgængelige.
   * Værdier sat til null er de parent ID'er som objektet har i sig, der endnu ikke har en funktion.
   * idSection variablen hentes fra parametrene, da den sendes med en GET/SELECT request
   * Andre variable hentes fra body, da de sendes med en POST/INSERT eller PUT/UPDATE request
   */
  constructor(req) {
    super();
    this.elementtype = `section`;
    this.table = `document_section`;

    this.idGroup        = (typeof req.session.idGroup     !== `undefined` ? req.session.idGroup     : undefined);
    this.idUser         = null;
    this.idDocument     = null;
    this.idSection      = (typeof req.params.idSection    !== `undefined` ? req.params.idSection    : undefined);
    this.sectionNumber  = (typeof req.body.sectionNumber  !== `undefined` ? req.body.sectionNumber  : undefined);
    this.sectionTitle   = (typeof req.body.sectionTitle   !== `undefined` ? req.body.sectionTitle   : undefined);
    this.sectionTeaser  = (typeof req.body.sectionTeaser  !== `undefined` ? req.body.sectionTeaser  : undefined);
    this.sectionContent = (typeof req.body.sectionContent !== `undefined` ? req.body.sectionContent : undefined);
  }

  /* Input : En Section er blevet oprettet med et unikt iddocument_section
   * Output: Returnere alle flashcard data som er tilknyttet den givne section.
   * Formål: At kunne få alle flashcard data tilhørende sectionen.
   */
  async getAllFlashcards() {
    const flash = new Flashcard();
    return flash.query(`SELECT *`, `iddocument_section = "${this.queryId}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  /* Input : En Section er blevet oprettet med et unikt iddocument_section
   * Output: Returnere alle quiz data som er tilknyttet den givne section.
   * Formål: At kunne få alle quiz data tilhørende sectionen.
   */
  async getAllQuizzes() {
    const q = new Quiz();
    return q.query(`SELECT *`, `iddocument_section = "${this.queryId}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  /* Input : En Section er blevet oprettet med et unikt iddocument_section
   * Output: Returnere alle data som er gemt i section tabellen til det tilknyttede id.
   * Formål: At kunne få alle data tilhørende sectionen.
   */
  getData() {
    return this.query(`SELECT *`, `iddocument_section = "${this.queryId}"`)
      .then((result) => result)
      .catch((error) => error);
  }
}

module.exports = {
  Section,
};
