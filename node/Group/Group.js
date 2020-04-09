/* eslint no-console: off */

const { Database } = require(`../Database/Database`);

/* UNDER CONSTRUCTION */

class Group extends Database {
  /* Input : requestet der sendes fra en klient, samt inheritance af Database objektet.
   * Output: Et objekt med unikt ID konstrueret med de givne variable tilknyttet det.
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
    this.table = `group`;

    this.idGroup = (typeof req.params.idGroup       !== `undefined` ? req.session.idGroup      : undefined);
  }
}

module.exports = {
  Group,
};
