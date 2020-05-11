/* eslint-disable guard-for-in */
/* eslint no-console: off */
const path = require(`path`);
const { Group } = require(`../Models/Group`);
const { User } = require(`../Models/User`);
const { Section } = require(`../Models/Section`);
const { Evaluation } = require(`../Models/Evaluation`);
const { QuizQuestion } = require(`../Models/QuizQuestion`);
const { QuizResult } = require(`../Models/QuizResult`);

/* UNDER CONSTRUCTION */

class CreateController {
  /* UNDER CONSTRUCTION */
  constructor() {
    this.name = `CreateController`;
    this.root = __dirname.slice(0, -(`node/Controllers`.length));
  }

  /* UNDER CONSTRUCTION */
  async createGroup(req, res) {
    const G = new Group(req);
    try {
      await G.insertToDatabase();
      res.redirect(`/groups`);
    }
    catch (error) {
      res.redirect(503, `/dbdown`);
    }
  }

  /* UNDER CONSTRUCTION */
  async createUser(req, res) {
    const U = new User(req);
    try {
      await U.insertToDatabase();
      res.redirect(`/login`);
    }
    catch (error) {
      res.redirect(503, `/dbdown`);
    }
  }

  /* UNDER CONSTRUCTION */
  async createSection(req, res) {
    const S = new Section(req);
    try {
      await S.insertToDatabase();
      res.redirect(`/view/sections/recipient`);
    }
    catch (error) {
      res.redirect(503, `/dbdown`);
    }
  }

  /* FIXME: UNDER CONSTRUCTION */
  async createEvaluation(req, res) {
    const E = new Evaluation(req);
    try {
      const idEvaluation = await E.insertToDatabase();
      res.send({ url: `/post/questions?idEvaluation=${idEvaluation}&titleEvaluation=${E.title}` });
    }
    catch (error) {
      res.redirect(503, `/dbdown`);
    }
  }

  /* Formål: At oprette nye quiz questions i databasen (bemærk flertal)
   * Input : req med questions fra klienten. res som bruges til at sende en respons til klienten
   * Output: Intet - men brugeren viderediriges med res til en ny URL
   */
  async createQuestions(req, res) {
    const QQ = new QuizQuestion(req);
    try {
      await QQ.insertToDatabase();
      res.redirect(`/view/evaluations/recipient`); // TODO: Kan eventuelt senere videredirigere til siden, hvor man kan tage evalueringen
    }
    catch (error) {
      res.redirect(503, `/dbdown`);
    }
  }

  /* Formål: At gemme en brugers svar, når brugeren har afsluttet en evaluering
   * Input : req med svar fra klienten. res som bruges til at sende en respons til klienten
   * Output: Intet - men brugeren viderediriges med res til en ny URL
   */
  async createAnswers(req, res) {
    const QR = new QuizResult(req);
    let idAttempt;
    let quizResultData;
    try {
      idAttempt = await QR.insertToDatabase();
      quizResultData = await QR.getHistoricQuizResultData(idAttempt, req.body.questionsArray);
      console.log(quizResultData);
      // for (let index = 0; index < QR.questionArray.length; index++) {
      //   QR.questionArray[index].successAttempts = 3;
      //   QR.questionArray[index].failedAttempts = 1;
      //   QR.questionArray[index].recentResult = true;
      //   QR.questionArray[index].repetitions = 2;
      //   QR.questionArray[index].nextRepetition = QR.calculateNextRepetitionTimeStampForEvaluation(QR.questionArray[index]);
      // }
      // QR.nextRepetition = QR.calculateNextRepetitionTimeStampForEvaluation(QR);
      // console.log(QR);

      res.send({ newURL: `/view/evaluationResult/${QR.idEvaluation}/${idAttempt}` });
    }
    catch (error) {
      console.log(error);
      res.redirect(503, `/dbdown`);
    }
  }
}


module.exports = {
  CreateController,
};
