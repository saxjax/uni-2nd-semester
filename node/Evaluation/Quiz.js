const { Evaluation } = require(`../Evaluation/Evaluation.js`);

class Quiz extends Evaluation {
  constructor(request) {
    super();
    this.name = `Quiz`;
    this.table = `quiz`;
    this.request = request;
    this.idquiz = `Not set`;
    this.elementtype = `quiz`;
    this.Question = `Not set`;
    this.Answer = [];
    // correctness er en binær repræsentation af svarernes sandhadsværdi "0001" betyder at answers[3] i er korrekt de andre er false!
    this.correctness = `0000`;
  }
}
module.exports = {
  Quiz,
};
