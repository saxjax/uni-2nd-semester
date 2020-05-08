class Question {
  constructor(questionContainer, index) {
    this.idQuestion         = questionContainer.getAttribute(`idQuestion`);
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
const { idEvaluation } = data.evaluation[0];
submitButton.addEventListener(`click`, submitAnswers);


async function submitAnswers() {
  const questionContainers = document.getElementsByClassName(`questionDiv`);
  const questionsArray = [];
  for (let i = 0; i < questionContainers.length; i++) {
    questionsArray.push(new Question(questionContainers[i], i));
    // Checks if the given answer is correct and saves the status to the Question object.
    questionsArray[i].correctAnswerGiven = questionsArray[i].userAnswers === questionsArray[i].correctAnswers;
  }

  const score = calculateScore(questionsArray);
  const body = { questionsArray, score, idEvaluation };
  const response = await fetch(`/post/answers/${idEvaluation}`, {
    method: `POST`,
    body: JSON.stringify(body),
    headers: { "Content-Type": `application/json` },
  });
  const responseJSON = await response.json();
  window.location.replace(responseJSON.newURL);
}


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
