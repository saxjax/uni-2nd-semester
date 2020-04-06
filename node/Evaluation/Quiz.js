const { Evaluation } = require(`../Evaluation/Evaluation.js`);

class Quiz extends Evaluation {
  constructor() {
    super();
    this.name = `Quiz`;
    this.table = `quiz`;
    this.idquiz = `Not set`;
    this.elementtype = `quiz`;
    this.Question = `Not set`;
    this.Answer = [];
    // correctness er en binær repræsentation af svarernes sandhadsværdi "0001" betyder at answers[3] i er korrekt de andre er false!
    this.correctness = `0000`;
  }

  // hent quiz_question indhold for det pågældende idquiz
  // input: idquiz
  // output: array indeholdende et antal quiz_question elementer
  async getQuiz() {
    this.table = `quiz_question`;
    return this.query(`SELECT *`, `idquiz = "${this.queryId}"`)
      .then((result) => result)
      .catch((error) => error);
  }
}
module.exports = {
  Quiz,
};
