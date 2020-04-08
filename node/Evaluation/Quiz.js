const { Evaluation } = require(`../Evaluation/Evaluation.js`);

class Quiz extends Evaluation {
  constructor(request) {
    super();
    this.elementtype = `quiz`;
    this.table = `quiz`;
    this.idquiz = `Not set`;
    this.Question = `Not set`;
    this.Answer = [];
    // correctness er en binær repræsentation af svarernes sandhadsværdi "0001" betyder at answers[3] i er korrekt de andre er false!
    this.correctness = `0000`;

    this.request = request;
    this.queryId = request !== undefined ? request.params.queryId : undefined;
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
