/* eslint no-console: off */

/* Spaced repetition er en funktion som stiller funktioner til rådighed for at udføre spaced repetition og active recall */

class SpacedRepetition {
  constructor() {
    this.nextRepetitionTask = [];
    this.minTimestamp = 24;// 24 timer
  }


  RunRepetition() {

  }

  calculateNextRepetitionForEvaluation(evaluationTask) {
    let rightWrongRatio = 0;
    
    if (evaluationTask.correctness === true) { // er svaret korrekt?
      if (evaluationTask.rep > 0) { // er evalueringsopgaven taget før?
        if (evaluationTask.history.wrong > 0) { // er evalueringsopgaven svaret forkert før?
          const rightWrongRatio = calcRightWrongRatio(evaluationTask.history); // udregn rigtig-forkert ratio
          if (rightWrongRatio >= 3) { // er ratioen større end lig med tre?
            this.calculateTimestamp(evaluationTask); // beregn tidsstempel
          }
          else { 
            this.calculateTimestamp(evaluationTask);
          }
        }
        else { // hvis den IKKE er blevet svaret forkert før, beregn da korrekt tidsstempel
          evaluationTask.history.correctness === true;
          this.calculateTimestamp(evaluationTask);
        }
      } // er evalueringen IKKE blevet taget før, tæl da evalueringen op som være repeteret og beregn tidsstempel
      else {
        evaluationTask.rep++;
        this.calculateTimestamp(evaluationTask);
      }
    } // hvis der svares forkert på evalueringen beregnes det korrekte tidsstempel 
    else {
      this.calculateTimestamp(evaluationTask);
    }
  }

  calculateTimestamp({ setMinTimestamp = true, currentTimestamp } = {}) {
    let newTimestamp;
    if (setMinTimestamp === true) {
      newTimestamp = Date.now() + this.minTimestamp;
    }
    else {
      newTimestamp = 2 * currentTimestamp;
    }

    return newTimestamp;
  }


  /*
  * NextRepetitiontask
  */
  populateNextRepetitionTask(evaluationLog) {
    forEach((evaluation) => {
      if (EvaluationIsDue()) {
        nextRepetitionTask.push(evaluation);
      }
    });
  }


  EvaluationIsDue() {
    Date.now();
  }
}
