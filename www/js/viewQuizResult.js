const questionDivs = document.getElementsByClassName(`questionDiv`);

/*
Dette forloop checker hvert spørgsmåls div igennem og tilføjer grøn farve hvis brugeren havde
svaret rigtigt og rød hvis forkert. Kalder funktioner, der viser hvilke svar brugeren havde indtastet
samt hvilke svar der er de rigtige.
*/
for (let i = 1; i <= questionDivs.length; i++) {
  if (data.evaluation[i - 1].result === `true`) {
    document.querySelector(`#question${i}`).classList.add(`true`);
  }
  else {
    document.querySelector(`#question${i}`).classList.add(`false`);
  }

  const htmlAnswersArray = document.querySelector(`#question${i}`).getElementsByTagName(`p`);
  showTheUsersAnswers(htmlAnswersArray, i);
  showTheCorrectAnswers(htmlAnswersArray, i);
}

/*
Viser hvilket svar der er det korrekte ud for en spørgsmålsdiv
*/
function showTheCorrectAnswers(htmlAnswersArray, i) {
  const correctAnswers = data.quizQuestions[i - 1].correctness.split(`;`);
  correctAnswers.forEach((answer, index) => {
    if (answer === `true`) {
      htmlAnswersArray[index].innerHTML += ` - (This was the correct answer)`;
      htmlAnswersArray[index].classList.add(`correctAnswer`);
    }
  });
}
/*
Viser hvilket svar brugeren har angivet ud for et bestemt spørgsmålsdiv.
*/
function showTheUsersAnswers(htmlAnswersArray, i) {
  const userAnswersArray = data.evaluation[i - 1].userAnswers.split(`;`);
  userAnswersArray.forEach((answer, index) => {
    if (answer === `true`) {
      htmlAnswersArray[index].innerHTML += ` - (Your answer)`;
      htmlAnswersArray[index].classList.add(`userAnswer`);
    }
  });
}
