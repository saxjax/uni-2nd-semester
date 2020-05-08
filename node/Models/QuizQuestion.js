/* eslint no-console: off */

const { Model }   = require(`./AbstractClasses/Model`);
const convertArrayToSemicolonSeparatedString = require(`../HelperFunctions/convertArrayToSemicolonSeparatedString`);


/* MANGLER DESIGN!!!!
 * Det kan vel ikke passe at vi hardcoder 4 svarmuligheder? kommaseparering/opreting af ny sql database /whatever er muligheder
 */
// TODO:
class QuizQuestion extends Model {
  // TODO:
  constructor(req) {
    super();
    this.elementType = `quiz_question`;
    this.table = `quiz_question`;
    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      // this.idDocument?
      // this.idSection?
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `DELETE`: case `UPDATE`:
          this.idColumnName = `ID_QUIZ_QUESTION`;
          this.idQuery = req.params.idQuery;
          this.loggedIn = req.session.loggedIn;
          break;
        case `POST`:
          this.idQuiz = req.body[0].idQuiz;
          this.questions = req.body;
          break;
        case `TEST`:
          this.elementtype = `quiz_question`;
          this.table = `quiz_question`;
          this.idSection =  undefined;
          this.idDocument =  undefined;
          this.idUser =  undefined;
          this.idGroup =  undefined;
          this.question =  undefined;
          this.answer1 =  undefined;
          this.answer2 =  undefined;
          this.answer3 =  undefined;
          this.answer4 =  undefined;
          break;
        default: break;
      }
    }
  }

  /* Formål: At kunne oprette den givne model i databasen ud fra posted data fra en form.
             Der bliver desuden automatisk oprettet de forskellige dependencies/foreign keys som objektet tilhører.
   * Input : Et objekt oprettet med et request med postdata i body samt user/group data i session
   * Output: True hvis queren inserter, ellers false hvis der sker en fejl.
   */
  async insertToDatabase() {
    const questionsPromiseArray = [];
    for (let i = 0; i < this.questions.length; i++) {
      const insertQuestionQuery = this.insertQuestionToDatabase(this.questions[i]);
      questionsPromiseArray.push(insertQuestionQuery);
    }
    try {
      await Promise.all(questionsPromiseArray);
      return true;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }

  /* Formål: At indsætte et nyt quiz question i databasen
   * Input : et question-objekt, som indeholder de fire ting, som man kan se i query()
   * Output: Et promise, som kommer fra query()
   */
  async insertQuestionToDatabase(question) {
    try {
      const answers = convertArrayToSemicolonSeparatedString(question.answers);
      const correctAnswers = convertArrayToSemicolonSeparatedString(question.correctAnswers);
      return await this.query(`INSERT`, `ID_EVALUATION = "${question.idEvaluation}" `
        + `AND QUESTION = "${question.question}" `
        + `AND CORRECT_ANSWERS = "${correctAnswers}" `
        + `AND KEYWORD = "${question.keyword}" `
        + `AND ANSWERS = "${answers}"`);
    }
    catch (error) {
      return error;
    }
  }
}
module.exports = {
  QuizQuestion,
};
