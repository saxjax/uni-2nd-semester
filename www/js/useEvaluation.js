class Question {
  constructor(questionContainer, index) {
    this.idQuestion         = questionContainer.getAttribute(`idQuestion`);
    this.idEvaluation       = data.questions[index].idEvaluation;
    this.questionText       = questionContainer.getElementsByClassName(`questionText`)[0].innerHTML;
    this.userAnswers        = this.getUserAnswers(questionContainer);
    this.correctAnswers     = data.questions[index].correctness;
    this.correctAnswerGiven = false;
  }

  getUserAnswers(questionContainer) {
    let userAnswers = ``;
    const userAnswerCheckboxes = questionContainer.getElementsByClassName(`correctAnswerCheckbox`);
    for (let i = 0; i < userAnswerCheckboxes.length; i++) {
      userAnswers = `${userAnswers + userAnswerCheckboxes[i].checked};`;
    }
    return userAnswers.slice(0, -1); // Sletter det sidste semikolon
  }
}

const submitButton = document.querySelector(`#submitButton`);
submitButton.addEventListener(`click`, submitAnswers);


/* Formål: Beregne resultatet efter en evaluering er blevet taget,
           og sender et POST til serveren som indsætter brugerens evaluerings resultat i databasen. */
async function submitAnswers() {
  const questionContainers = document.getElementsByClassName(`questionDiv`);
  const questionsArray = [];
  for (let i = 0; i < questionContainers.length; i++) {
    questionsArray.push(new Question(questionContainers[i], i));
    // Checker om svaret er korrekt og gemmer statusen i Question objectet.
    questionsArray[i].correctAnswerGiven = questionsArray[i].userAnswers === questionsArray[i].correctAnswers;
  }
  const score = calculateScore(questionsArray);
  const body = { questionsArray, score };
  const response = await fetch(`/post/answers/`, {
    method: `POST`,
    body: JSON.stringify(body),
    headers: { "Content-Type": `application/json` },
  });
  const responseJSON = await response.json();

  if (responseJSON.error) {
    alert(responseJSON.error);
  }
  else {
    window.location.replace(responseJSON.newURL);
  }
}

/* Formål: Tæller hvor mange points (korrekt besvarede spørgsmål) brugeren har opnået efter en quiz.
*  Input : Array af spørgsmål
*  Output: Points brugeren har tjænt, max mulige points.
*/
function calculateScore(questionsArray) {
  let points = 0;
  const total = questionsArray.length;
  questionsArray.forEach((question) => {
    if (question.correctAnswerGiven) {
      points++;
    }
  });
  return { points, total };
}
