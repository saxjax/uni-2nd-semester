/* eslint no-console: off */

/* Spaced repetition er en funktion som stiller funktioner til rådighed for at udføre spaced repetition og active recall */





class SpacedRepetition {
  constructor() {
    this.nextRepetitionTask = [];
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

  setNextRepTimestampForEvaluations(evaluationLog){
    let tempLog = evaluationLog
    tempLog.forEach((eval)=>{
      eval.nextRepTimeStamp = this.calculateNextRepetitionTimeStampForEvaluation(eval).nextRepTimeStamp;
    })
    return tempLog
  }

  // Input: evaluationTask med følgende properties: correctness, antal tidligere repetitions, wrong answers count, right answers count //
  // Output: //

  calculateNextRepetitionTimeStampForEvaluation(evaluationTask) {
    const tempEvalTask = evaluationTask;//kopierer input parameteren fordi vi vil returnere en muteret version.
    let rightWrongRatio = 0;
    let setMinTimestamp = true;
   

    if (evaluationTask.correctness === true) { // er svaret på spørgsmålet korrekt?
      if (evaluationTask.rep > 0) { // er evalueringsopgaven taget før?
        if (evaluationTask.wrongAnswersCount > 0) { // er evalueringsopgaven svaret forkert før?
          rightWrongRatio = (evaluationTask.wrongAnswersCount / evaluationTask.rightAnswersCount); // udregn rigtig-forkert ratio
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
    tempEvalTask.nextRepTimeStamp = this.calculateTimeStamp(setMinTimestamp, evaluationTask.rightAnswersCount); // beregn tidsstempel

    return tempEvalTask;
  }


  calculateTimeStamp(setMinTimestamp = true, rightAnswersCount) {
    let newRepTimeStamp= new Date();
    
    if (setMinTimestamp === true) {
      newRepTimeStamp.setHours(newRepTimeStamp.getHours()+ this.minTimestamp);
    }
    else {
      newRepTimeStamp.setHours(newRepTimeStamp.getHours()+ ((rightAnswersCount * rightAnswersCount) * this.minTimestamp)  ) ;
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


const spacedR = new SpacedRepetition();
let evalLog = []
let evalTask = {
  wrongAnswersCount: 2, rightAnswersCount: 2, correctness: true, rep: 4, nextRepTimeStamp: 0,
};

evalTask = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
evalLog.push(evalTask)
console.log(evalTask);

evalTask.rightAnswersCount ++
evalTask = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
evalLog.push(evalTask)
console.log(evalTask);

evalTask.correctness = false
evalTask.wrongAnswersCount++
evalTask = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
evalLog.push(evalTask)
console.log(evalTask);

evalTask.rightAnswersCount ++
evalTask.correctness = true
evalTask = spacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask)
console.log(evalTask);


