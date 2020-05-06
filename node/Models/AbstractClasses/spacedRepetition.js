/* eslint no-console: off */

/* Spaced repetition er en funktion som stiller funktioner til rådighed for at udføre spaced repetition og active recall */

class SpacedRepetition {
  constructor() {
    this.nextRepetitionTask = [];
    this.minTimestamp = 24;// 24 timer
  }


  RunRepetition() {

  }

  calculateNextRepetitionForEvaluation() {

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
