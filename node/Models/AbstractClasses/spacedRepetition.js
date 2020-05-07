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

  // Input: evaluationTask med følgende properties: correctness, antal tidligere repetitions, wrong answers count, right answers count //
  // Output: //

  calculateNextRepetitionTimeStampForEvaluation(evaluationTask) {
    let rightWrongRatio = 0;
    let setMinTimestamp = true;
    const tempEvalTask = evaluationTask; // tempEvalTask bruges så vi kan skrive til objektet evaluationTask, men vi behøver ikke bruge tempEvalTask når vi blot læser på evaluationTask i funktionen

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

    tempEvalTask.rep++;
    tempEvalTask.nextRepTimeStamp = this.calculateTimestamp(setMinTimestamp, evaluationTask.rightAnswersCount); // beregn tidsstempel

    return tempEvalTask;
  }

  calculateTimeStamp(setMinTimestamp = true, rightAnswersCount) {
    let newRepTimeStamp;
    if (setMinTimestamp === true) {
      newRepTimeStamp = Date.now() + this.minTimestamp;
    }
    else {
      newRepTimeStamp = (rightAnswersCount * rightAnswersCount) * this.minTimestamp;
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
