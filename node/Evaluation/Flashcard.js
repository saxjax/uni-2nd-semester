const { Evaluation } = require(`../Evaluation/Evaluation.js`);

/* UNDER CONSTRUCTION */

class Flashcard extends Evaluation {
  /* Input : requestet der sendes fra en klient, samt inheritance af Database objektet.
   * Output: Et objekt med unikt ID konstrueret med de givne variable tilknyttet det.
   * Variablene over mellemrummet inheriter og overskriver JS database modulet.
   * Elementtype er en kolonne i databasen der angiver type, mens table angiver tabellen.
   * Variablene under mellemrummet har navn efter tabelens SQL database kolonner.
   * groupId variablen hentes fra cookies, da de altid skal være tilgængelige.
   * Værdier sat til null er de parent ID'er som objektet har i sig, der endnu ikke har en funktion.
   * idFlashcard variablen hentes fra parametrene, da den sendes med en GET/SELECT request
   * Andre variable hentes fra body, da de sendes med en POST/INSERT eller PUT/UPDATE request
   */
  constructor(req) {
    super();
    this.elementtype = `flashcard`;
    this.table = `flashcard`;

    // this.idGroup = (typeof req.session.idGroup  !== `undefined` ? req.session.idGroup  : undefined);
    this.idUser = null;
    this.idDocument = null;
    this.idSection = null;
    this.idFlashcard = (typeof req.params.idFlashcard       !== `undefined` ? req.session.idFlashcard      : undefined);
    this.concept = `Not set`;// begreb
    this.definition = `Not set`;
  }

  // FIXME: virker ikke!!
  // Formål: Hent flashcard indhold for det pågældende idflashcard
  // Input : this.idFlashcard fra constructoren
  // Output: array med 1 element indeholdende et flashcard
  async getFlashcard() {
    return this.query(`SELECT *`, `idflashcard = "${this.idFlashcard}"`)
      .then((result) => result)
      .catch((error) => error);
  }
}
module.exports = {
  Flashcard,
};
