const { Evaluation } = require(`./AbstractClasses/Evaluation.js`);

class QuizQuestion extends Evaluation {
  constructor(req) {
    super();
    this.elementType = `quiz`;
    this.table = `quiz`;
    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      switch (req.method) {
        case `GET`: case `DELETE`: case `UPDATE`:
          this.idColumnName = `ID_QUIZ_QUESTION`;
          this.idQuery = req.params.idQuery;
          this.loggedIn = req.session.loggedIn;
          break;
        case `POST`:
          this.question = req.body.question;
          this.answers = req.body.answers.split(`;`);
          this.correctness = req.body.correctness;
          break;
        default: break;
      }
    }
  }

  // UNDER CONSTRUCTION!
  // upload the single quizQuestion to databse
  // input: Question
  // output: true, if it was possible to upload, otherwise false
  async saveQuizQuestion() {
    // post quiz to database
    try {
      await this.query(`INSERT`, `
        question = ${this.question} AND
        answers = ${this.answers}
        elementType = ${this.elementType} AND 
        correctness = ${this.correctness}`);
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
}
module.exports = {
  QuizQuestion,
};
