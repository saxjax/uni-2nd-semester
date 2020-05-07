const questionDivs = document.getElementsByClassName(`questionDiv`);

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

function showTheCorrectAnswers(htmlAnswersArray, i) {
  const correctAnswers = data.quizQuestions[i - 1].correctness.split(`;`);
  correctAnswers.forEach((answer, index) => {
    if (answer === `true`) {
      htmlAnswersArray[index].innerHTML += ` - (This was the correct answer)`;
      htmlAnswersArray[index].classList.add(`correctAnswer`);
    }
  });
}

function showTheUsersAnswers(htmlAnswersArray, i) {
  const userAnswersArray = data.evaluation[i - 1].userAnswers.split(`;`);
  userAnswersArray.forEach((answer, index) => {
    if (answer === `true`) {
      htmlAnswersArray[index].innerHTML += ` - (Your answer)`;
      htmlAnswersArray[index].classList.add(`userAnswer`);
    }
  });
}
