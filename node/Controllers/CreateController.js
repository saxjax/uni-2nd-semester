/* eslint-disable guard-for-in */
/* eslint no-console: off */
const { Group } = require(`../Models/Group`);
const { User } = require(`../Models/User`);
const { Document } = require(`../Models/Document`);
const { Section } = require(`../Models/Section`);
const { Evaluation } = require(`../Models/Evaluation`);
const { QuizQuestion } = require(`../Models/QuizQuestion`);
const { QuizResult } = require(`../Models/QuizResult`);
const { ErrorController } = require(`./AbstractControllers/ErrorController`);

/* UNDER CONSTRUCTION */

class CreateController extends ErrorController {
  /* UNDER CONSTRUCTION */
  constructor(settings) {
    super(settings.debug);
    this.name = `CreateController`;
    this.root = settings.root;
  }

  /* Formål: Gør det muligt for en bruger at oprette et grupperum.
   * Input : @req.body har alle post data
   * Output: En redirect til /groups siden
   */
  async createGroup(req, res) {
    const G = new Group(req);
    try {
      await G.insertToDatabase();
      res.send({ url: `/groups` });
    }
    catch (error) {
      const errorMsg = this.produceErrorMessageToUser(error);
      res.send({ error: errorMsg });
    }
    G.connect.end();
  }

  /* Formål: At oprette en bruger i databasen hvis registrerings informationen er valid.
   * Input : Username, Password, Firstname, Lastname, Semester, University, Email, Studysubject.
   * Output: Opretter bruger eller informerer om fejl.
   */
  async RegisterNewUser(req, res) {
    const newUser = new User(req);
    try {
      await newUser.validateRegister();
      await newUser.insertToDatabase();
      res.redirect(`/`);
    }
    catch (error) { // User could not be validated
      const errorMsg = this.produceErrorMessageToUser(error);
      res.send(errorMsg);
    }
    newUser.connect.end();
  }

  /* UNDER CONSTRUCTION */
  async createDocument(req, res) {
    const D = new Document(req);
    try {
      const idQuery = await D.insertToDatabase();
      res.redirect(`/view/sectionsAndEvaluations/document/${idQuery}`);
    }
    catch (error) {
      const errorMsg = this.produceErrorMessageToUser(error);
      res.send(errorMsg);
    }
    D.connect.end();
  }

  /* UNDER CONSTRUCTION */
  async createSection(req, res) {
    const S = new Section(req);
    try {
      const idSection = await S.insertToDatabase();
      res.send({ url: `/view/section/${idSection}` });
    }
    catch (error) {
      const errorMsg = this.produceErrorMessageToUser(error);
      res.send({ error: errorMsg });
    }
    S.connect.end();
  }

  /* FIXME: UNDER CONSTRUCTION */
  async createEvaluation(req, res) {
    const E = new Evaluation(req);
    try {
      const idEvaluation = await E.insertToDatabase();
      res.send({ url: `/post/questions?idEvaluation=${idEvaluation}&titleEvaluation=${E.title}` });
    }
    catch (error) {
      const errorMsg = this.produceErrorMessageToUser(error);
      res.send({ error: errorMsg });
    }
    E.connect.end();
  }

  /* Formål: At oprette nye quiz questions i databasen (bemærk flertal)
   * Input : req med questions fra klienten. res som bruges til at sende en respons til klienten
   * Output: Intet - men brugeren viderediriges med res til en ny URL
   */
  async createQuestions(req, res) {
    const QQ = new QuizQuestion(req);
    try {
      await QQ.insertToDatabase();
      res.send({ url: `/view/evaluations/expert` }); // TODO: Kan eventuelt senere videredirigere til siden, hvor man kan tage evalueringen
    }
    catch (error) {
      const errorMsg = this.produceErrorMessageToUser(error);
      res.send({ error: errorMsg });
    }
    QQ.connect.end();
  }

  /* Formål: At gemme en brugers svar, når brugeren har afsluttet en evaluering
   * Input : req med svar fra klienten. res som bruges til at sende en respons til klienten
   * Output: Intet - men brugeren viderediriges med res til en ny URL
   */
  async createAnswers(req, res) {
    const QR = new QuizResult(req);
    try {
      const idAttempt = await QR.insertToDatabase();
      const quizResultData = await QR.getHistoricQuizResultData(idAttempt, req.body.questionsArray);
      await QR.insertToDatabaseSpacedRepetition(quizResultData.resultData);
      res.send({ newURL: `/view/evaluationResult/${idAttempt}` });
    }
    catch (error) {
      const errorMsg = this.produceErrorMessageToUser(error);
      res.send({ error: errorMsg });
    }
    QR.connect.end();
  }
}

module.exports = {
  CreateController,
};
