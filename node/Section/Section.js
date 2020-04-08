/* eslint no-console: off */

const { Database } = require(`../Database/Database`);
const { Flashcard } = require(`../Evaluation/Flashcard`);
const { Quiz } = require(`../Evaluation/Quiz`);

/* Section er det objekt som indeholder data vedrørende de afsnit der findes i et dokument.
 * UDVID MED INFORMATION NÅR SECTION ER DESIGNET
 */

class Section extends Database {
  /* Input : requestet der sendes fra en klient, samt inheritance af Database objektet.
   * Output: Et objekt konstrueret med de givne variable tilknyttet det.
   * Variablene over mellemrummet inheriter og overskriver JS database modulet.
   * Variablene under mellemrummet har navn efter tabelens SQL database kolonner.
   * groupId og userId variablene hentes fra cookies, da altid skal være tilgængelige.
   * queryId variablen hentes fra parametrene, da de sendes med en GET/SELECT request
   * Andre variable hentes fra body, da de sendes med en POST/INSERT eller PUT/UPDATE request
   */
  constructor(req) {
    super();
    this.elementtype = `section`;
    this.table = `document_section`;

    this.groupId         = (typeof req.session.groupId     !== `undefined` ? req.session.groupId      : undefined);
    this.userId          = (typeof req.session.userId      !== `undefined` ? req.session.userId       : undefined);
    this.queryId         = (typeof req.params.queryId      !== `undefined` ? req.params.queryId       : undefined);
    this.section_number  = (typeof req.body.sectionNumber  !== `undefined` ? req.body.section_number  : undefined);
    this.section_title   = (typeof req.body.sectionTitle   !== `undefined` ? req.body.section_title   : undefined);
    this.section_teaser  = (typeof req.body.sectionTeaser  !== `undefined` ? req.body.section_teaser  : undefined);
    this.section_content = (typeof req.body.sectionContent !== `undefined` ? req.body.section_content : undefined);
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
