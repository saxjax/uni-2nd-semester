/* eslint-disable guard-for-in */
/* eslint no-console: off */
const { Group } = require(`../Models/Group`);
const { User } = require(`../Models/User`);
const { Document } = require(`../Models/Document`);
const { Section } = require(`../Models/Section`);
const { Evaluation } = require(`../Models/Evaluation`);
const { QuizQuestion } = require(`../Models/QuizQuestion`);
const { QuizResult } = require(`../Models/QuizResult`);

/* UNDER CONSTRUCTION */

class CreateController {
  /* UNDER CONSTRUCTION */
  constructor(root) {
    this.name = `CreateController`;
    this.root = root;
  }

  /* UNDER CONSTRUCTION */
  async createGroup(req, res) {
    const G = new Group(req);
    try {
      await G.insertToDatabase();
      res.redirect(`/groups`);
    }
    catch (error) {
      res.redirect(204, `/dbdown`);
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
      res.redirect(204, `/dbdown`);
    }
  }

  /* UNDER CONSTRUCTION */
  async createDocument(req, res) {
    const D = new Document(req);
    try {
      const document = await D.insertToDatabase();
      res.redirect(`/view/sections/document/${document[0].idDocument}`);
    }
    catch (error) {
      console.log(error);
      res.redirect(503, `/dbdown`);
    }
  }

  /* UNDER CONSTRUCTION */
  async createSection(req, res) {
    const S = new Section(req);
    try {
      const section = await S.insertToDatabase();
      res.send({ url: `/view/section/${section[0].idSection}` });
    }
    catch (error) {
      res.redirect(204, `/dbdown`);
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
      res.redirect(204, `/dbdown`);
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
      res.redirect(204, `/dbdown`);
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
        quizResult.idQuizQuestion = quizResult.ID_QUIZ_QUESTION;
        quizResult.idUser = quizResult.ID_USER;
        quizResult.recentResult = quizResult.RECENT_RESULT;
        quizResult.recentAttemptDate = quizResult.RECENT_ATTEMPT_DATE;
        quizResult.nextRepetition = quizResult.NEXT_REPITITION;
        quizResult.repetitions = quizResult.TOTAL;
        quizResult.failedAttempts = quizResult.FAILED_ATTEMPTS;
        quizResult.successAttempts = quizResult.SUCESS_ATTEMPTS;
        quizResult.nextRepetition = QR.calculateNextRepetitionTimeStampForEvaluation(quizResult);
      });

      quizResultData.resultData.forEach((quizResult) => {
        quizResult.NEXT_REPITITION = quizResult.nextRepetition;
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
