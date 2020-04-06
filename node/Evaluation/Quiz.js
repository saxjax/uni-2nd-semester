const { Evaluation } = require(`../Evaluation/Evaluation.js`);
const { QuizQuestion } = require(`../Evaluation/QuizQuestion.js`);

class Quiz extends Evaluation {
  constructor(req) {
    super();
    this.name = `Quiz`;
    this.table = `quiz`;
    this.req = req;
    this.idquiz = `Not set`;
    this.elementtype = `quiz`;
    this.Questions = this.createQuizQuestionsArr();
  }

  // UNDER CONSTRUCTION!
  // Uploads quiz to database
  // returns true, if it was possible to upload to database, else false
  async saveQuiz() {
    try {
      this.query(`INSERT`);
      return true;
    }
    catch (error) {
      console.log(`there was an error: ${error}`);
      return false;
    }
  }

  // UNDER CONSTRUCTION!
  // input: req
  // Create array of quiz questions, by splitting the req into chunks,
  // that can be used to make each question object
  // output an array of quesitions
  createQuizQuestionsArr() {
    const quizQuestionArr = [];
    const entries = Object.entries(this.req.body);
    console.log(entries);
    const quizQuestionReq = { body: { Question: {} } };
    let i = 1;

    entries.forEach((element) => {
      if (/Question/.test(element[0])) {
        quizQuestionReq.body.Question[i] += element[1];
        i++;
      }
    });
    console.log(quizQuestionReq);

    const q = new QuizQuestion(req);
    quizQuestionArr.push(q);
  }

  // UNDER CONSTRUCTION!
  // no input
  // Gets the entire quiz from databse
  getQuiz() {
    // get quiz from databse
  }
}
module.exports = {
  Quiz,
};
