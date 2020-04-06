const { EvaluationElement } = require(`../Evaluation/EvaluationElement.js`);

class QuizQuestion extends EvaluationElement {
  constructor(req) {
    super();
    this.name = `QuizQuestion`;
    this.table = `quiz_question`;
    this.req = req;
    this.idquiz = `Not set`;
    this.Question = (req.body.Question === undefined ? false : req.body.Question[0]);
    this.Answer1 = ``;
    this.Answer2 = ``;
    this.Answer3 = ``;
    this.Answer4 = ``;
    // correctness er en binær repræsentation af svarernes sandhadsværdi "0001" betyder at answers[3] i er korrekt de andre er false!
    this.correctness = this.translateCorrectness();
  }

  // UNDER CONSTRUCTION!
  // upload the single quizQuestion to databse
  // input: Question
  // output: true, if it was possible to upload, otherwise false
  async saveQuizQuestion() {
    // post quiz to database
    try {
      await this.query(`INSERT`,
        `idquiz = ${this.idquiz} AND
        question = ${this.Question} AND
        answer1 = ${this.Answer1} AND
        answer2 = ${this.Answer2} AND
        answer3 = ${this.Answer3} AND
        answer4 = ${this.Answer4} AND
        elementtype = ${this.elementtype} AND 
        correct_answer = ${this.correctness}`);
      return true;
    }
    catch (error) {
      console.log(`there was an error: ${error}`);
      return false;
    }
  }

  // UNDER CONSTRUCTION!
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

  translateAnswers() {

  }
}

module.exports = {
  QuizQuestion,
};
