/* eslint no-console: off */

/* Spaced repetition er en funktion som stiller funktioner til rådighed for at udføre spaced repetition og active recall */

class SpacedRepetition {
  constructor() {
    const nextRepetitionTask = [];
  }


  RunRepetition() {

  }

  calculateNextRepetitionForEvaluation() {

  }

  calculateTimestamp() {

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
