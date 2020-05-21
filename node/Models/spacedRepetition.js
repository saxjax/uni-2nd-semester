/* eslint no-console: off */

/* Spaced repetition er en funktion som stiller funktioner til rådighed for at udføre spaced repetition og active recall */
const { Model } = require(`./AbstractClasses/Model`);


// extend Model
class SpacedRepetition extends Model {
  /* Alle spacedRepetitionType/Col og Table er hentet fra ParseSql! */
  constructor() {
    super();
    this.minTimestamp = 2; // 24 timer
    this.comprehentionRatio = 3; // hvert forkert svar kræver mindst 3 rigtige svar for at blive registreret som forstået
    this.repetitionScalar = 1;
    this.elementType = `${this.spacedRepetitionType}`;
    this.table = `${this.spacedRepetitionTable}`;
  }


  /* Formål: Hente alle quizquestions hvor datoen er due til at blive afviklet, de hentes fra tabellen repetition_task
   * Input:  NONE
   * Output: et array af quizQuestions
   */
  async getTasksforRepetition() {
    let repetitionTasks = []; // idQuizQuestion array
    let quizContent = [];// array af quizquestions

    repetitionTasks = await this.getIdQuizquestionsDueForRepetition();// henter array af idQuizQuestions.

    if (repetitionTasks.length > 0) {
      quizContent = await this.getQuizQuestionContent(repetitionTasks);// henter array af quizQuestions.
      return quizContent;
    }
    return [];// returnerer et tomt array hvis der ikke er nogen quizquestions som er due til afvikling
  }


  /* Formål: At returnere et array af idQuizQuestions fra repetition_task hvor RepetitionDate er nu eller tidligere
   * Input: NONE
   * Output: et array af idQuizQuestions
   */
  async getIdQuizquestionsDueForRepetition() {
    const trueObjectTable = this.table;
    const repetitionTasks = [];
    const now = (new Date()).toISOString().slice(0, 19).replace(`T`, ` `);// konverterer en JS Date til SQL format

    this.table = `${this.spacedRepetitionTable}`;// sætter table til repetition_task for en sikkerhedsskyld, da denne funktion kan kaldes fra andre klasser
    const queryResult = await this.query(`SELECT ${this.quizQuestionCol}`, `${this.SRRepetitionDate} <= "${now}" 
                                    AND ${this.userCol} = "${this.idUser}" 
                                    AND ${this.groupCol} = "${this.idGroup}"`);

    queryResult.forEach((element) => {
      if (element.idQuizQuestion !== undefined) { // populerer repetitiontasks med idQuizQuestions hvis der er nogen til repetition
        repetitionTasks.push(element.idQuizQuestion);
      }
    });
    this.table = trueObjectTable;
    return repetitionTasks;
  }

  /* Formål: At få fat i indholdet for quiz spørgsmål baseret på en række quizQuiestion id'er
   * Input: Et array af quizQuestion id'er
   * Output: Et array med objekter af quizQuestion indhold: idQuizQuestion: '5e5ccfd5-944e-11ea-af8f-2c4d54532c7a',
                                                            idEvaluation: '52e17040-944e-11ea-af8f-2c4d54532c7a',
                                                            question: 'What is an html div?',
                                                            answers: [Array],
                                                            correctness: 'false;true',
                                                            keywords: '123KeywordQuestion'
   */
  async getQuizQuestionContent(idQuizQuestions) {
    const trueObjectTable = this.table;
    this.table = `quiz_Question`;
    let quizQuestionContent = [];


    if (idQuizQuestions.length > 0) {
      const string = this.createQueryStringFromQuestionIDs(idQuizQuestions);
      quizQuestionContent = await this.query(`SELECT *`, `${string}`);
    }
    this.table = trueObjectTable;
    return quizQuestionContent;
  }

  /* Formål: Vi ønsker at lave en string på følgende form: `ID_QUIZ_QUESTION = "blablabla" OR "dumbludbudlibum"`.
   * Alt efter hvor mange id'er der ligger i array'et vil der efterfølgende blive lavet et nyt OR og det efterfølgende quizQuestion ID, indtil der ikke er flere ID'er.
   * Denne string returneres i funktionen getQuizQuestionContent(), hvor den bruges til at få fat i det indhold der matcher de forskellige quizQuestion ID'er vi har i array'et idQuizQuestions.
   * Input: Et array af quizQuestion ID'er
   * Output: En string på den korrekte form (illustreret i Formål)
   */
  createQueryStringFromQuestionIDs(idQuizQuestions) {
    let string = ``;
    idQuizQuestions.forEach((element, index) => {
      if (index > 0) {
        string += ` OR `;
      }
      string += `ID_QUIZ_QUESTION = "${element}"`;
    });
    string += ` ;`;

    return string;
  }


  /* Formål:Indsætte/opdatere  idQuizquestions i repetition_task tabellen
   * Input: resultData: på formen
                                  [
                                  RowDataPacket {
                                    idQuizQuestion: '6b0f6da9-8e00-11ea-a6c9-2c4d54532c7a',
                                    idUser: '553e422d-7c29-11ea-86e2-2c4d54532c7a',
                                    recentResult: 'true',
                                    recentAttemptDate: 2020-05-13T13:16:40.000Z,
                                    nextRepetition: 2020-05-26T23:16:40.974Z,
                                    repetitions: 14,
                                    failedAttempts: 3,
                                    successAttempts: 11
                                  },
                                  RowDataPacket {
                                  },
                                  RowDataPacket {
                                  }
                                ]
   * Output: Bool som angiver om dataene er blevet indsat i databasen
   */
  async insertToDatabaseSpacedRepetition(resultData) {
    let successfullInsert = false;
    const trueObjectTable = this.table; // refererer til QuizResults table i dette tilfælde
    this.table = `repetition_task`;

    resultData.forEach(async (result) => {
      result.nextRepetition = result.nextRepetition.toISOString().slice(0, 19).replace(`T`, ` `); // eslint-disable-line no-param-reassign
      await this.query(`CUSTOM`, `INSERT INTO ${this.table} (ID_QUIZ_QUESTION, ID_USER, ID_GROUP, REPETITION_DATE) 
                    VALUES ("${result.idQuizQuestion}", "${result.idUser}", "${this.idGroup}", "${result.nextRepetition}") ON DUPLICATE KEY UPDATE REPETITION_DATE = "${result.nextRepetition}" `);
      successfullInsert = true;
    });

    this.table = trueObjectTable;
    return successfullInsert;
  }

  // spacedrepetition algoritmen udgøres af funktionerne : calculateNextRepetitionTimeStampForEvaluation() og calculateTimeStamp() //

  /*
   * Formål: Afgør Hvilket timestamp der skal knyttes til et evaluation result , minimum eller et beregnet.
   * Input: et evaluationResult med følgende properties: recentResult (true/false), antal tidligere repetitions, failedAttempts, successAttempts
   * Output: en dato for næste repetition .
  */
  calculateNextRepetitionTimeStampForEvaluation(evaluationResult) {
    let newRepTimestamp = 0;
    let rightWrongRatio = 0;
    let setMinTimestamp = true; // hvis setMinTimestamp er sat til TRUE, betyder det, at brugeren skal have evalueringsopgaven indenfor de næste 24 timer

    if (evaluationResult.recentResult === `false`) { // hvis der svares forkert på opgaven
      setMinTimestamp = true;
    }
    else if (evaluationResult.repetitions < 2) { // du svarer rigtigt og evalueringen er IKKE taget før
      this.repetitionScalar = 2;
      setMinTimestamp = false;
    }
    else if (evaluationResult.failedAttempts > 0) { // du svarer rigtigt, men evalueringen er taget før OG der er blevet svaret forkert før
      rightWrongRatio = (evaluationResult.successAttempts / evaluationResult.failedAttempts);
      this.repetitionScalar =  rightWrongRatio > 1 ? rightWrongRatio : 1;
      setMinTimestamp = false;
    }
    else if (evaluationResult.failedAttempts < 1) { // du svarer rigtigt, evalueringen er taget før, men du har aldrig svaret forkert før
      this.repetitionScalar = evaluationResult.successAttempts;
      setMinTimestamp = false;
    }
    else {
      setMinTimestamp = true; // hvis intet kan beregnes, sæt da minTimestamp til true
    }

    newRepTimestamp = this.calculateTimeStamp(setMinTimestamp); // beregn tidsspunkt

    return newRepTimestamp;
  }

  /*
  * Formål: Beregn timestamp for næste spaced-repetition
  * Input : setMinimumTimestamp = true/false, successAttempts=(antal gange spørgsmålet er besvaret korrekt)
  * Output: Dato
  */
  calculateTimeStamp(setMinTimestamp = true) {
    const newRepTimeStamp = new Date();

    if (setMinTimestamp === true) { // hvis der er svaret forkert eller comprehentionRatio ikke er opfyldt
      newRepTimeStamp.setHours(newRepTimeStamp.getHours() + this.minTimestamp);
    }
    else {
      newRepTimeStamp.setHours(newRepTimeStamp.getHours() + ((this.repetitionScalar * this.repetitionScalar) * this.minTimestamp));
    }

    return newRepTimeStamp;
  }
}

module.exports = {
  SpacedRepetition,
};
