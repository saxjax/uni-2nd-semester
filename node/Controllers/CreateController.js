/* eslint-disable guard-for-in */
/* eslint no-console: off */
const { Group } = require(`../Models/Group`);
const { User } = require(`../Models/User`);
const { Document } = require(`../Models/Document`);
const { Section } = require(`../Models/Section`);
const { Evaluation } = require(`../Models/Evaluation`);
const { QuizQuestion } = require(`../Models/QuizQuestion`);
const { QuizResult } = require(`../Models/QuizResult`);
const { ErrorController } = require(`./ErrorController`);

/* UNDER CONSTRUCTION */

class CreateController extends ErrorController {
  /* UNDER CONSTRUCTION */
  constructor(root) {
    super();
    this.name = `CreateController`;
    this.root = root;
  }

  /* Formål: Gør det muligt for en bruger at oprette et grupperum.
   * Input : @req.body har alle post data
   * Output: En redirect til /groups siden
   */
  async createGroup(req, res) {
    const G = new Group(req);
    try {
      G.insertToDatabase();
      res.redirect(`/groups`);
    }
    catch (error) {
      res.redirect(204, `/dbdown`);
    }
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
  }

  /* UNDER CONSTRUCTION */
  async createDocument(req, res) {
    const D = new Document(req);
    try {
      const document = await D.insertToDatabase();
      res.redirect(`/view/sectionsAndEvaluations/document/${document[0].idDocument}`);
    }
    catch (error) {
      const errorMsg = this.produceErrorMessageToUser(error);
      res.send(errorMsg);
    }
  }

  /* UNDER CONSTRUCTION */
  async createSection(req, res) {
    try {
      const S = new Section(req);
      const idSection = await S.insertToDatabase();
      res.send({ url: `/view/section/${idSection}` });
    }
    catch (error) {
      const errorMsg = this.produceErrorMessageToUser(error);
      res.send({ error: errorMsg });
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
      const errorMsg = this.produceErrorMessageToUser(error);
      res.send({ error: errorMsg });
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
      res.send({ url: `/view/evaluations/recipient` }); // TODO: Kan eventuelt senere videredirigere til siden, hvor man kan tage evalueringen
    }
    catch (error) {
      const errorMsg = this.produceErrorMessageToUser(error);
      res.send({ error: errorMsg });
    }
  }

  /* Formål: At gemme en brugers svar, når brugeren har afsluttet en evaluering
   * Input : req med svar fra klienten. res som bruges til at sende en respons til klienten
   * Output: Intet - men brugeren viderediriges med res til en ny URL
   */
  /*
    resultData: [
    RowDataPacket {
      ID_EVALUATION: '3d91313e-8e00-11ea-a6c9-2c4d54532c7a',
      ID_QUIZ_QUESTION: '6b0f6da9-8e00-11ea-a6c9-2c4d54532c7a',
      ID_USER: '553e422d-7c29-11ea-86e2-2c4d54532c7a',
      RECENT_RESULT: 'true',
      RECENT_ATTEMPT_DATE: 2020-05-11T12:19:50.000Z,
      NEXT_REPITITION: '-----',
      TOTAL: 18,
      FAILED_ATTEMPTS: 10,
      SUCESS_ATTEMPTS: 8
    },
    resultData: [
    RowDataPacket {
      ID_EVALUATION: '3d91313e-8e00-11ea-a6c9-2c4d54532c7a',
      ID_QUIZ_QUESTION: '6b0f6da9-8e00-11ea-a6c9-2c4d54532c7a',
      ID_USER: '553e422d-7c29-11ea-86e2-2c4d54532c7a',
      RECENT_RESULT: 'true',
      RECENT_ATTEMPT_DATE: 2020-05-11T14:24:47.000Z,
      NEXT_REPITITION: '-----',
      TOTAL: 11,
      FAILED_ATTEMPTS: 2,
      SUCESS_ATTEMPTS: 9,
      idQuizQuestion: '6b0f6da9-8e00-11ea-a6c9-2c4d54532c7a',
      idUser: '553e422d-7c29-11ea-86e2-2c4d54532c7a',
      recentResult: 'true',
      recentAttemptDate: 2020-05-11T14:24:47.000Z,
      nextRepetition: 2020-05-31T20:24:46.924Z,
      repetitions: 11,
      failedAttempts: 2,
      successAttempts: 9
    },
    RowDataPacket {
      ID_EVALUATION: '3d91313e-8e00-11ea-a6c9-2c4d54532c7a',
      ID_QUIZ_QUESTION: '6b10793b-8e00-11ea-a6c9-2c4d54532c7a',
      ID_USER: '553e422d-7c29-11ea-86e2-2c4d54532c7a',
      RECENT_RESULT: 'false',
      RECENT_ATTEMPT_DATE: 2020-05-11T14:24:47.000Z,
      NEXT_REPITITION: '-----',
      TOTAL: 10,
      FAILED_ATTEMPTS: 1,
      SUCESS_ATTEMPTS: 9,
      idQuizQuestion: '6b10793b-8e00-11ea-a6c9-2c4d54532c7a',
      idUser: '553e422d-7c29-11ea-86e2-2c4d54532c7a',
      recentResult: 'false',
      recentAttemptDate: 2020-05-11T14:24:47.000Z,
      nextRepetition: 2020-05-12T14:24:46.924Z,
      repetitions: 10,
      failedAttempts: 1,
      successAttempts: 9
    },
    RowDataPacket {
      ID_EVALUATION: '3d91313e-8e00-11ea-a6c9-2c4d54532c7a',
      ID_QUIZ_QUESTION: '6b1174c9-8e00-11ea-a6c9-2c4d54532c7a',
      ID_USER: '553e422d-7c29-11ea-86e2-2c4d54532c7a',
      RECENT_RESULT: 'true',
      RECENT_ATTEMPT_DATE: 2020-05-11T14:24:47.000Z,
      NEXT_REPITITION: '-----',
      TOTAL: 10,
      FAILED_ATTEMPTS: 4,
      SUCESS_ATTEMPTS: 6,
      idQuizQuestion: '6b1174c9-8e00-11ea-a6c9-2c4d54532c7a',
      idUser: '553e422d-7c29-11ea-86e2-2c4d54532c7a',
      recentResult: 'true',
      recentAttemptDate: 2020-05-11T14:24:47.000Z,
      nextRepetition: 2020-05-13T20:24:46.925Z,
      repetitions: 10,
      failedAttempts: 4,
      successAttempts: 6
    }
  ]
  */
  async createAnswers(req, res) {
    const QR = new QuizResult(req);
    let idAttempt;
    let quizResultData;
    try {
      idAttempt = await QR.insertToDatabase();
      quizResultData = await QR.getHistoricQuizResultData(idAttempt, req.body.questionsArray);

      quizResultData.resultData.forEach((quizResult) => {
        const result = quizResult;
        result.idQuizQuestion = quizResult.ID_QUIZ_QUESTION;
        result.idUser = quizResult.ID_USER;
        result.recentResult = quizResult.RECENT_RESULT;
        result.recentAttemptDate = quizResult.RECENT_ATTEMPT_DATE;
        result.nextRepetition = quizResult.NEXT_REPITITION;
        result.repetitions = quizResult.TOTAL;
        result.failedAttempts = quizResult.FAILED_ATTEMPTS;
        result.successAttempts = quizResult.SUCESS_ATTEMPTS;
        result.nextRepetition = QR.calculateNextRepetitionTimeStampForEvaluation(quizResult);
      });

      quizResultData.resultData.forEach((quizResult) => {
        const result = quizResult;
        result.NEXT_REPITITION = quizResult.nextRepetition;
      });
    }
    catch (error) {
      console.log(error);
      res.redirect(503, `/dbdown`);
    }

    try {
      await QR.insertToDatabaseSpacedRepetition(quizResultData.resultData);
      res.send({ newURL: `/view/evaluationResult/${idAttempt}`, quizResultData });
    }
    catch (error) {
      console.log(error);
      res.redirect(204, `/dbdown`);
    }
  }
}


module.exports = {
  CreateController,
};
