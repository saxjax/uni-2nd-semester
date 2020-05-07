/* eslint no-console: off */

/* Spaced repetition er en funktion som stiller funktioner til rådighed for at udføre spaced repetition og active recall */
const { Model } = require(`./AbstractClasses/Model`);




class SpacedRepetition extends Model {
  constructor(req) {
    super(req)
    // this.nextRepetitionTask = [];
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

  // setNextRepTimestampForEvaluations(evaluationLog){
  //   let tempLog = evaluationLog
  //   tempLog.forEach((eval)=>{
  //     eval.nextRepTimeStamp = this.calculateNextRepetitionTimeStampForEvaluation(eval).nextRepTimeStamp;
  //   })
  //   return tempLog
  // }

  // Input: evaluationTask med følgende properties: recentResult, antal tidligere repetitions, wrong answers count, right answers count //
  // Output: //

  calculateNextRepetitionTimeStampForEvaluation(evaluationResult) {
    const tempEvalTask = evaluationResult;//kopierer input parameteren fordi vi vil returnere en muteret version.
    let rightWrongRatio = 0;
    let setMinTimestamp = true;
   

    if (evaluationResult.recentResult === true) { // er svaret på spørgsmålet korrekt?
      if (evaluationResult.repetitions > 0) { // er evalueringsopgaven taget før?
        if (evaluationResult.failedAttempts > 0) { // er evalueringsopgaven svaret forkert før?
          rightWrongRatio = (evaluationResult.failedAttempts / evaluationResult.successAttempts); // udregn rigtig-forkert ratio
          if (rightWrongRatio >= this.comprehentionRatio) { // er comprehention ratioen større end lig med tre?
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
    tempEvalTask.nextRepTimeStamp = this.calculateTimeStamp(setMinTimestamp, evaluationResult.successAttempts); // beregn tidsstempel

    return tempEvalTask;
  }


  calculateTimeStamp(setMinTimestamp = true, successAttempts) {
    let newRepTimeStamp= new Date();
    
    if (setMinTimestamp === true) {
      newRepTimeStamp.setHours(newRepTimeStamp.getHours()+ this.minTimestamp);
    }
    else {
      newRepTimeStamp.setHours(newRepTimeStamp.getHours()+ ((successAttempts * successAttempts) * this.minTimestamp)  ) ;
    }

    return newRepTimeStamp;
  }


  /*
  * NextRepetitiontask
  */
  populateNextRepetitionTask(evaluationLog) {
    evaluationLog.forEach((evaluationTask) => {
      if (evaluationTask.nextRepTimeStamp <= Date.now()) {
        this.nextRepetitionTask.push(evaluationTask);
      }
    });
  }


  EvaluationIsDue() {
    Date.now();
  }
}

module.exports = {
  SpacedRepetition,
};

const req = {};
const spacedR = new SpacedRepetition(req);
let evalLog = []
let evalTask = {
  failedAttempts: 2, successAttempts: 2, recentResult: true, rep: 4, nextRepTimeStamp: 0,
};

// evalTask = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
// evalLog.push(evalTask)
// console.log(evalTask);

// evalTask.successAttempts ++
// evalTask = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
// evalLog.push(evalTask)
// console.log(evalTask);

// evalTask.recentResult = false
// evalTask.failedAttempts++
// evalTask = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
// evalLog.push(evalTask)
// console.log(evalTask);

// evalTask.successAttempts ++
// evalTask.recentResult = true
// evalTask = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
// console.log(evalTask);


