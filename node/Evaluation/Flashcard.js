const { Evaluation } = require(`../Evaluation/Evaluation.js`);

class Flashcard extends Evaluation {
  constructor(request) {
    super();
    this.name = `Flashcard`;
    this.table = `flashcard`;
    this.request = request;
    this.idfalshcard = `Not set`;
    this.elementtype = `flashcard`;
    this.concept = `Not set`;// begreb
    this.definition = `Not set`;
    // correctness er en binær repræsentation af svarernes sandhadsværdi "0001" betyder at answers[3] i er korrekt de andre er false!
  }
}
module.exports = {
  Flashcard,
};
