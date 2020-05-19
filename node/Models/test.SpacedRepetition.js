/* eslint no-console: off */

// const { SpacedRep } = require(`./spacedRepetition `);

// const SpacedR = new SpacedRep();


const evalTask1 = {
  failedAttempts: 0, successAttempts: 1, recentResult: `true`, repetitions: 1, // repScalar = 2 da det er første gang den tages og der svares rigtigt
};

const evalTask2 = {
  failedAttempts: 5, successAttempts: 15, recentResult: `true`, repetitions: 20, // repScalar = 3, den er repeteret før og rightWrongRatio beregnes da
};

const evalTask3 = {
  failedAttempts: 20, successAttempts: 15, recentResult: `true`, repetitions: 35, // repScalar = 1, den er taget før og rightWrongRatio beregnes til mindre end 1, derfor bliver repScalar = 1
};

const evalTask4 = {
  failedAttempts: 0, successAttempts: 15, recentResult: `true`, repetitions: 20, // repScalar = 15, den er taget før og der er aldrig svaret forkert, derfor repScalar = 15 (succesAttempts)
};

const evalTask5 = {
  failedAttempts: 5, successAttempts: 15, recentResult: `false`, repetitions: 2, // repScalar = ligegyldig da der svares forkert
};


const minTimestamp = 24;
let repetitionScalar = 0;
let result = 0;

function calculateNextRepetitionTimeStampForEvaluation(evaluationResult) {
  let newRepTimestamp = 0;
  let rightWrongRatio = 0;
  let setMinTimestamp = true; // hvis setMinTimestamp er sat til TRUE, betyder det, at brugeren skal have evalueringsopgaven indenfor de næste 24 timer

  if (evaluationResult.recentResult === `false`) { // hvis der svares forkert på opgaven
    setMinTimestamp = true;
  }
  else if (evaluationResult.repetitions < 2) { // du svarer rigtigt og evalueringen er IKKE taget før
    repetitionScalar = 2;
    setMinTimestamp = false;
  }
  else if (evaluationResult.repetitions > 1 && evaluationResult.failedAttempts > 0) { // du svarer rigtigt, men evalueringen er taget før OG der er blevet svaret forkert før
    rightWrongRatio = (evaluationResult.successAttempts / evaluationResult.failedAttempts);
    repetitionScalar =  rightWrongRatio > 1 ? rightWrongRatio : 1;
    setMinTimestamp = false;
  }
  else if (evaluationResult.repetitions > 1 && evaluationResult.failedAttempts < 1) { // du svarer rigtigt, evalueringen er taget før, men du har aldrig svaret forkert før
    repetitionScalar = evaluationResult.successAttempts;
    setMinTimestamp = false;
  }
  else {
    setMinTimestamp = true; // hvis intet kan beregnes, sæt da minTimestamp til true
  }

  console.log(setMinTimestamp);
  console.log(`repetitionScarlar`, repetitionScalar);

  newRepTimestamp = calculateTimeStamp(setMinTimestamp); // beregn tidsspunkt

  return newRepTimestamp;
}


function calculateTimeStamp(setMinTimestamp = true) {
  const newRepTimeStamp = new Date();

  if (setMinTimestamp === true) { // hvis der er svaret forkert eller comprehentionRatio ikke er opfyldt
    newRepTimeStamp.setHours(newRepTimeStamp.getHours() + minTimestamp);
  }
  else {
    newRepTimeStamp.setHours(newRepTimeStamp.getHours() + ((repetitionScalar * repetitionScalar) * minTimestamp));
  }

  return newRepTimeStamp;
}

console.log(`HEEEEEEEEEEEEEEEREEEEEEEEEEEEE WWEEEEEEEEEEEEEEEEEE GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO!`);
console.log(`evalTask 1: Forventet: false og RepetitionScalar: 2`);
result = calculateNextRepetitionTimeStampForEvaluation(evalTask1);


console.log(result);
console.log(`\n\n`);


console.log(`evalTask 2: Forventet: false og RepetitionScalar: 3`);
result = calculateNextRepetitionTimeStampForEvaluation(evalTask2);

console.log(result);
console.log(`\n\n`);


console.log(`evalTask 3: Forventet: false og RepetitionScalar: 1`);
result = calculateNextRepetitionTimeStampForEvaluation(evalTask3);

console.log(result);
console.log(`\n\n`);


console.log(`evalTask 4: Forventet: false og RepetitionScalar: 15`);
result = calculateNextRepetitionTimeStampForEvaluation(evalTask4);

console.log(result);
console.log(`\n\n`);


console.log(`evalTask 5: Forventet: true og bør repeteres om 24 timer`);
result = calculateNextRepetitionTimeStampForEvaluation(evalTask5);

console.log(result);
console.log(`\n\n`);
