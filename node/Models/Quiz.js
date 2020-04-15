const { Model } = require(`./AbstractClasses/Model.js`);

class Quiz extends Model {
  constructor(req) {
    super();
    this.elementtype = `quiz`;
    this.table = `quiz`;
    // Session
    this.groupId = (typeof req.session.groupId  !== `undefined` ? req.session.groupId  : undefined);
    this.userId  = (typeof req.session.userId    !== `undefined` ? req.session.userId     : undefined);
    // ID
    this.idColumnName = `idquiz`;
    this.queryId = (typeof req.params.queryId       !== `undefined` ? req.params.queryId      : undefined);
    // Columns
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
}
module.exports = {
  Quiz,
};
