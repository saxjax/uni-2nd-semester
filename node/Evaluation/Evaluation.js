const { Database } = require(`../Database/Database.js`);

/* UNDER CONSTRUCTION */

class Evaluation extends Database {
  /* UNDER CONSTRUCTION */
  /* Denne abstrakte klasse skal defineres ud fra hvad der samler de forskellige evalueringsmetoder
   * Mangler design for hvad den kan tilføje af funktionalitet. Kræver diskussion.
   */
  constructor() {
    super();
    this.elementtype = null;
    this.idColumnName = null;
    this.table = null;
  }
}


module.exports = {
  Evaluation,
};
