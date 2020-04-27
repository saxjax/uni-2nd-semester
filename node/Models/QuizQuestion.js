/* eslint no-console: off */

const { Evaluation } = require(`./AbstractClasses/Evaluation.js`);

/* MANGLER DESIGN!!!!
 * Det kan vel ikke passe at vi hardcoder 4 svarmuligheder? kommaseparering/opreting af ny sql database /whatever er muligheder
 */
// TODO:
class QuizQuestion extends Evaluation {
  // TODO:
  constructor(req) {
    super();
    this.elementType = `quiz_question`;
    this.table = `quiz`;
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
          this.question = req.body.question;
          this.answers = req.body.answers.split(`;`);
          this.correctness = req.body.correctness;
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

  // TODO: Kan ikke laves før design af hvordan quizquestion skal laves er fastsat.
  /* Formål: At kunne oprette den givne model i databasen ud fra posted data fra en form.
             Der bliver desuden automatisk oprettet de forskellige dependencies/foreign keys som objektet tilhører.
   * Input : Et objekt oprettet med et request med postdata i body samt user/group data i session
   * Output: True hvis queren inserter, ellers false hvis der sker en fejl.
   */
  async insertToDatabase() {
    try {
      await this.query(`ID_USER_GROUP = "${this.idGroup}" `
        + `AND ID_USER = "${this.idUser}" `
        + `AND ID_DOCUMENT = "${this.idDocument}" `
        + `AND ID_DOCUMENT_SECTION = "${this.idSection}" `
        + `AND SOMETHING MORE? = "${this.something}"`);
    }
    catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  // TODO:
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
