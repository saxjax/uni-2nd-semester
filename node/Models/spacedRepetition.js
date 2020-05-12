/* eslint no-console: off */

/* Spaced repetition er en funktion som stiller funktioner til rådighed for at udføre spaced repetition og active recall */
const { Model } = require(`./AbstractClasses/Model`);


// extend Model
class SpacedRepetition extends Model {
  constructor() {
    super();
    this.minTimestamp = 24; // 24 timer
    this.comprehentionRatio = 3; // hvert forkert svar kræver mindst 3 rigtige svar for at blive registreret som forstået
    this.repetitionInterval = 1;
    this.elementType = `repetition_task`;
    this.table = `repetition_task`;
  }

  async insertToDatabaseSpacedRepetition(resultData) {
    const trueObjectTable = this.table; // refererer til QuizResults table i dette tilfælde
    this.table = `repetition_task`;
    console.log(this.idGroup);
    console.log(this.table);

    resultData.forEach((result) => {
      result.nextRepetition = result.nextRepetition.toISOString().slice(0, 19).replace(`T`, ` `);
      try {
        this.query(`CUSTOM`, `INSERT INTO ${this.table} (ID_QUIZ_QUESTION, ID_USER, ID_GROUP, REPETITION_DATE) 
                    VALUES ("${result.idQuizQuestion}", "${result.idUser}", "${this.idGroup}", "${result.nextRepetition}") ON DUPLICATE KEY UPDATE REPETITION_DATE = "${result.nextRepetition}" `);
      }
      catch (error) {
        console.log(error);
        return false;
      }
      return true;
    });

    this.table = trueObjectTable;
    return true;
  }

  async getTasksforRepetition() {
    const repetitionTasks = [];
    let queryResult;
    let now = new Date();
    now = now.toISOString().slice(0, 19).replace(`T`, ` `);
    console.log(now);

    try {
      queryResult = await this.query(`CUSTOM`, `SELECT * FROM p2.repetition_task where Repetition_date <= "${now}" 
                                      AND ID_USER = "${this.idUser}" 
                                      AND ID_GROUP = "${this.idGroup}" ;`);
    }
    catch (error) {
      console.log(error);
    }
  }


  RunRepetition() {

  }

  // spacedrepetition algoritmen udgøres af funktionerne : calculateNextRepetitionTimeStampForEvaluation() og calculateTimeStamp() //

  /*
   * Formål: Afgør Hvilket timestamp der skal knyttes til et evaluation result
   * Input: et evaluationResult med følgende properties: recentResult (true/false), antal tidligere repetitions, failedAttempts, successAttempts
   * Output:
  */
  calculateNextRepetitionTimeStampForEvaluation(evaluationResult) {
    let newRepTimestamp = 0;
    let rightWrongRatio = 0;
    let setMinTimestamp = true; // hvis setMinTimestamp er sat til TRUE, betyder det, at brugeren skal have evalueringsopgaven indenfor de næste 24 timer, hvis FALSE skal evalueringsopgaven repeteres senere.
    console.log(`spacedrepetition l 37`);
    console.log(evaluationResult);


    if (evaluationResult.recentResult === `true`) { // er der blevet svaret korrekt på spørgsmålet?
      if (evaluationResult.repetitions > 1) { // er evalueringsopgaven blevet taget før?
        if (evaluationResult.failedAttempts > 0) { // er evalueringsopgaven svaret forkert før?
          rightWrongRatio = (evaluationResult.successAttempts / evaluationResult.failedAttempts); // udregn rigtig-forkert ratio
          this.repetitionInterval =  rightWrongRatio > 1 ? rightWrongRatio : 1;// sæt repetitionsinterval til mindst 1, ellers = rightWrongRatio
        }
        else { // hvis den IKKE er blevet svaret forkert på før OG du svarer rigtigt, sæt repetitionsintervallet = antal rigtige svar
          this.repetitionInterval = evaluationResult.successAttempts;
        }
      }
      else { // der er svaret rigtet OG det er første gang evalueringesopgaven er besvaret.
        this.repetitionInterval = 1;
      }

      setMinTimestamp = false; // hvis der svares rigtigt så skal timestampet ALTID beregnes til false
    }

    else { // hvis der svares forkert på evalueringen sættes setMinTimestamp til true
      setMinTimestamp = true;
    }

    newRepTimestamp = this.calculateTimeStamp(setMinTimestamp); // beregn tidsstempel

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
      newRepTimeStamp.setHours(newRepTimeStamp.getHours() + ((this.repetitionInterval * this.repetitionInterval) * this.minTimestamp));
    }

    return newRepTimeStamp;
  }


  /*
  * Formål: opret et array med alle de evaluerings objekter som skal afvikles NU
  * Input : array af Results
  * Output: array med der reults som skal afvikles nu.
  */
  selectEvaluationsForRepetition(evaluationLog) {
    const nextRepetitionTask = [];
    evaluationLog.forEach((evaluationResult) => {
      if (evaluationResult.nextRepTimeStamp <= Date.now()) {
        nextRepetitionTask.push(evaluationResult);
      }
    });
    return nextRepetitionTask;
  }
}

module.exports = {
  SpacedRepetition,
};


// TEST AF FUNKTIONALITETER
// const req = {};
// const spacedR = new SpacedRepetition(req);
// const evalLog = [];
// const evalTask = {
//   failedAttempts: 1, successAttempts: 1, recentResult: true, repetitions: 3,
// };

// evalTask.nextRepTimeStamp = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask);
// // evalLog.push(evalTask)
// console.log(`#1:${evalTask.nextRepTimeStamp}`);

// for (let index = 0; index < 3; index++) {
//   evalTask.successAttempts++;
//   // evalTask.repetitions++
//   evalTask.nextRepTimeStamp = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask);
//   // console.log(`#2:`+evalTask.nextRepTimeStamp);
//   const copy = { ...evalTask };
//   evalLog.push(copy);
// // console.log(copy)
// }
// for (let index = 0; index < 3; index++) {
//   evalTask.failedAttempts++;
//   evalTask.recentResult = false;
//   // evalTask.repetitions++
//   evalTask.nextRepTimeStamp = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask);
//   // console.log(`#2:`+evalTask.nextRepTimeStamp);
//   const copy = { ...evalTask };
//   evalLog.push(copy);
//  console.log(copy)
// }

// evalTask.successAttempts ++
// evalTask.nextRepTimeStamp = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
// console.log(`#3:`+evalTask.nextRepTimeStamp);

// evalTask.successAttempts ++
// evalTask.nextRepTimeStamp = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
// console.log(`#4:`+ evalTask.nextRepTimeStamp);


// evalTask.recentResult = false
// evalTask.failedAttempts++
// evalTask.nextRepTimeStamp = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
// console.log("#5 false "+evalTask.nextRepTimeStamp);

// evalTask.successAttempts ++
// evalTask.recentResult = true
// evalTask = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
// console.log(evalTask);
// console.log(spacedR.selectEvaluationsForRepetition(evalLog));
// console.log(`disse ligger alle i evalLog`);
// console.log(evalLog);
