class Question {
  constructor(questionContainer) {
    this.idEvaluation   = this.getIdEvaluation();
    this.question       = questionContainer.getElementsByClassName(`questionInput`)[0].value;
    this.answers        = this.getAnswers(questionContainer);
    this.correctAnswers = this.getCorrectAnswers(questionContainer);
    this.keyword        = questionContainer.getElementsByClassName(`keywordInput`)[0].value;
  }

  /* Formål: Få fat i evaluering ID'et fra query-strengen
   * Input : -
   * Output: Evaluerings ID'et i en tekststreng
   */
  getIdEvaluation() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(`idEvaluation`);
  }

  /* Formål: Få fat i de værdier, som er i svarinputfelterne, semikolonseparerede dem og returnere dem som en streng
   * Input : questionContainer, som er den div, som indkapsler spørgsmålet
   * Output: Brugerens svar, som vil være semikolonseparerede i en tekststreng
   */
  getAnswers(questionContainer) {
    const answers = [];
    const answerInputs = questionContainer.getElementsByClassName(`answerInput`);
    for (let i = 0; i < answerInputs.length; i++) {
      answers.push(answerInputs[i].value);
    }
    return answers;
  }

  /* Formål: Få fat i de boolske værdier, som er i svarinputfelterne korresponderende checkbox, semikolonseparerede dem og returnere dem som en streng
   * Input : questionContainer, som er den div, som indkapsler spørgsmålet
   * Output: En semikolonsepareret tekststreng, som indeholder boolske værdier, som angiver, hvorvidt det korresponderende svar er rigtigt eller forkert
   */
  getCorrectAnswers(questionContainer) {
    const correctAnswers = [];
    const correctAnswerCheckboxes = questionContainer.getElementsByClassName(`correctAnswerCheckbox`);
    for (let i = 0; i < correctAnswerCheckboxes.length; i++) {
      correctAnswers.push(correctAnswerCheckboxes[i].checked);
    }
    return correctAnswers;
  }
}

/* Formål: Poste alle questions når brugeren trykker på submit-knappen
 * Input : -
 * Output: Intet - men efter brugerens questions er oprettet i databasen videredirigeres brugeren til en URL, som er bestemt fra serversiden
 */
document.getElementById(`submit`).addEventListener(`click`, postQuizQuestions);
async function postQuizQuestions() {
  const questionContainers = document.getElementsByClassName(`questionContainer`);
  const questionsArray = [];

  for (let i = 0; i < questionContainers.length; i++) {
    questionsArray.push(new Question(questionContainers[i]));
  }

  const response = await fetch(`/post/questions`, {
    method: `POST`,
    body: JSON.stringify(questionsArray),
    headers: { "Content-Type": `application/json` },
  });

  window.location.replace(response.url);
}
