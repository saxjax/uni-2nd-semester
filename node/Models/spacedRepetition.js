/* eslint no-console: off */

/* Spaced repetition er en funktion som stiller funktioner til rådighed for at udføre spaced repetition og active recall */
const { Model } = require(`./AbstractClasses/Model`);



//extend Model
class SpacedRepetition extends Model {
  constructor() {
    super()
    this.minTimestamp = 24; // 24 timer
    this.comprehentionRatio = 3; // hvert forkert svar kræver mindst 3 rigtige svar for at blive registreret som forstået
  }

  // const spacedRep = new SpacedRepetition();
  // evaluationTask = spacedRep.calculateNextRepetitionTimeStampForEvaluation(evaluationTask);
  // evaluationLog.push(evaluationTask);

  // spacedRep.populateNextRepetitionTask(evaluationLog);
  // spacedRep.NextRepetitiontask[];

  RunRepetition() {

  }

//spacedrepetition algoritmen udgøres af funktionerne : calculateNextRepetitionTimeStampForEvaluation() og calculateTimeStamp() 
  /* Formål: Afgør Hvilket timestamp der skal knyttes til et evaluation result  
  // Input: et evaluationResult med følgende properties: recentResult (true/false), antal tidligere repetitions, failedAttempts, successAttempts //
  // Output: //
*/
  calculateNextRepetitionTimeStampForEvaluation(evaluationResult) {
    let newRepTimestamp 
    let rightWrongRatio = 0;
    let setMinTimestamp = true;
   

    if (evaluationResult.recentResult === true) { // er svaret på spørgsmålet korrekt?
      if (evaluationResult.repetitions > 0) { // er evalueringsopgaven taget før?
        if (evaluationResult.failedAttempts > 0) { // er evalueringsopgaven svaret forkert før?
          rightWrongRatio = (evaluationResult.successAttempts / evaluationResult.failedAttempts); // udregn rigtig-forkert ratio
          if (rightWrongRatio < this.comprehentionRatio) { // er comprehention ratioen større end lig med tre?
            setMinTimestamp = true;
          }
          else { 
            setMinTimestamp = false;
          }
        }
        else { // hvis den IKKE er blevet svaret forkert før, beregn da korrekt tidsstempel
          setMinTimestamp = false;
        }
      } // er evalueringen IKKE blevet taget før beregn tidsstempel
      else {
        setMinTimestamp = false;
      }
    } // hvis der svares forkert på evalueringen beregnes det korrekte tidsstempel 
    else {
      setMinTimestamp = true;
    }

    // tempEvalTask.rep++;
    newRepTimestamp = this.calculateTimeStamp(setMinTimestamp, evaluationResult.successAttempts); // beregn tidsstempel

    return newRepTimestamp;
  }

/*
  * Formål: Beregn timestamp for næste spaced-repetition 
  * Input : setMinimumTimestamp = true/false, successAttempts=(antal gange spørgsmålet er besvaret korrekt)
  * Output: Dato
  */
  calculateTimeStamp(setMinTimestamp = true, successAttempts) {
    let newRepTimeStamp= new Date();
    
    if (setMinTimestamp === true) {//hvis der er svaret forkert eller comprehentionRatio ikke er opfyldt
      newRepTimeStamp.setHours(newRepTimeStamp.getHours()+ this.minTimestamp);
    }
    else {
      newRepTimeStamp.setHours(newRepTimeStamp.getHours()+ ((successAttempts * successAttempts) * this.minTimestamp)  ) ;
    }

    return newRepTimeStamp;
  }


  /*
  * Formål: opret et array med alle de evaluerings objekter som skal afvikles NU
  * Input : array af Results
  * Output: array med der reults som skal afvikles nu.
  */
  selectEvaluationsForRepetition(evaluationLog) {
    let nextRepetitionTask =[]
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








// TEST

const req = {};
const spacedR = new SpacedRepetition(req);
let evalLog = []
let evalTask = {
  failedAttempts: 1, successAttempts:1, recentResult: true, repetitions: 3, 
};



evalTask.nextRepTimeStamp = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
// evalLog.push(evalTask)
console.log(`#1:`+evalTask.nextRepTimeStamp);




for (let index = 0; index < 3; index++) {

evalTask.successAttempts ++
// evalTask.repetitions++
evalTask.nextRepTimeStamp = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
// console.log(`#2:`+evalTask.nextRepTimeStamp);
const copy = Object.assign({}, evalTask);
evalLog.push(copy) 
// console.log(copy)
}
for (let index = 0; index < 3; index++) {

  evalTask.failedAttempts ++
  evalTask.recentResult = false
  // evalTask.repetitions++
  evalTask.nextRepTimeStamp = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
  // console.log(`#2:`+evalTask.nextRepTimeStamp);
  const copy = Object.assign({}, evalTask);
  evalLog.push(copy) 
  // console.log(copy)
  }


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
console.log(spacedR.selectEvaluationsForRepetition(evalLog))
console.log("disse ligger alle i evalLog")
console.log(evalLog);

