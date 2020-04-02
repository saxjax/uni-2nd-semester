const { Evaluation } = require(`../Evaluation/Evaluation.js`);

class Quiz extends Evaluation {
  constructor(req) {
    super();
    this.name = `Quiz`;
    this.table = `quiz`;
    this.req = req;
    this.idquiz = `Not set`;
    this.elementtype = `quiz`;
    this.Question = (req.body.Question === undefined ? false : req.body.Question[0]);
    this.Answer = [];
    // correctness er en binær repræsentation af svarernes sandhadsværdi "0001" betyder at answers[3] i er korrekt de andre er false!
    this.correctness = this.translateCorrectness();
  }

  uploadQuiz() {
    // post quiz to database
  }

  getQuiz() {
    // get quiz from databse
  }

  // input: req
  // output: for digit string ex. 1100
  // translates true/false of all answers into a binary string
  // /correctness/.test(element[0] checks every [0] of elements, to see if it contains the string /correctness/, if it does, it returns true. thereby skipping all other elements than correctness_#
  translateCorrectness() {
    let currentCorrectness = ``;
    const entries = Object.entries(this.req.body);
    entries.forEach((element) => {
      if (/correctness/.test(element[0])) {
        if (element[1] === `true`) {
          currentCorrectness += `1`;
        }
        else {
          currentCorrectness += `0`;
        }
      }
    });
    return currentCorrectness;
  }
}
module.exports = {
  Quiz,
};
