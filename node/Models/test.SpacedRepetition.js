/* eslint no-console: off */

const { SpacedRep } = require(`./spacedRepetition `);

const SpacedR = new SpacedRep();


const evalTask = {
  wrongAnswersCount: 2, rightAnswersCount: 2, correctness: true, rep: 4, nextRepTimeStamp: 0,
};

console.log(
  SpacedR.calculateNextRepetitionTimeStampForEvaluation(evalTask),
);
