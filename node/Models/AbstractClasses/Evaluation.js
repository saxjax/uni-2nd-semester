const { Model } = require(`./Model.js`);

/* UNDER CONSTRUCTION */

class Evaluation extends Model {
  /* UNDER CONSTRUCTION */
  /* Denne abstrakte klasse skal defineres ud fra hvad der samler de forskellige evalueringsmetoder
   * Mangler design for hvad den kan tilføje af funktionalitet. Kræver diskussion.
   */
  constructor(req) {
    super(req);
    this.elementtype = null;
    this.table = null;
  }
}

module.exports = {
  Evaluation,
};
