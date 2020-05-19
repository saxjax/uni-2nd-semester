/* eslint no-undef: 0 */
// Test her: http://localhost:3000/post/questions?titleEvaluation=Test (Der kan ikke submittes)

const addAnotherQuestionButtons = document.querySelectorAll(`.addAnotherQuestionButton`);
let questionCount = 0;

// ON LOAD //
// Includes quiz name in quizTitleHeader
const urlParams = new URLSearchParams(window.location.search);
const titleEvaluation = urlParams.get(`titleEvaluation`);
const evaluationTitleHeader = document.getElementById(`quizTitleHeader`);
evaluationTitleHeader.innerHTML = `Tilføj nye spørgsmål til ${titleEvaluation}`;

addAnotherQuestion(); // Tilføjer automatisk et spørgsmål, når htmlen er loadet.
// /ON LOAD //

addAnotherQuestionButtons.forEach((button) => {
  button.addEventListener(`click`, addAnotherQuestion);
});

function addAnotherQuestion() {
  const uniqueQuestionId = `question${++questionCount}`;

  const questionContainer = insertDomNode(`DIV`, addAnotherQuestionButtons[1], undefined, [{ class: `questionContainer` }]);

  const questionInputContainer = appendDomNode(`DIV`, questionContainer, undefined, [{ class: `questionInputContainer` }]);
  const questionLabel = appendDomNode(`LABEL`, questionInputContainer, `Spørgsmål:`);
  questionLabel.htmlFor = uniqueQuestionId; // Corresponderer til nedenstående input.id
  const questionInput = appendDomNode(`INPUT`, questionInputContainer, `Indtast dit spørgsmål her`, [{ id: uniqueQuestionId }, { class: `questionInput` }]);
  questionInput.name = uniqueQuestionId;

  addAnswerElements(questionContainer);
  addKeywordElements(questionContainer);
  const removeQuestionBtn = appendDomNode(`BUTTON`, questionContainer, `X`, [{ class: `removeQuestionBtn` }, { class: `btn` }, { class: `btn-danger` }]);
  removeQuestionBtn.addEventListener(`click`, () => {
    const amountOfQuestions = document.getElementsByClassName(`questionContainer`).length;
    if (amountOfQuestions > 1) {
      questionContainer.remove();
    }
    else {
      displayErrorMessage(questionContainer, `Du skal indtaste mindst 1 spørgsmål.`); // Ligger i createInputField.js
    }
  });
}

function addAnswerElements(questionContainer) {
  const allAnswersContainer = appendDomNode(`DIV`, questionContainer, undefined, [{ class: `answersContainer` }]);
  const addAnotherAnswerButton = appendDomNode(`BUTTON`, questionContainer, `Tilføj svar`);
  createAnswerField(allAnswersContainer);
  createAnswerField(allAnswersContainer);
  addAnotherAnswerButton.addEventListener(`click`, () => {
    createAnswerField(allAnswersContainer);
  });
}

function createAnswerField(appendToThis) {
  const inputFieldContainer = createInputField(appendToThis, `Svar`, 2);

  const removeButton = inputFieldContainer.getElementsByClassName(`removeSvarBtn`)[0];
  const correctAnswerCheckbox = insertDomNode(`INPUT`, removeButton, undefined, [{ class: `correctAnswerCheckbox` }]);
  correctAnswerCheckbox.type = `checkbox`;
  correctAnswerCheckbox.title = `Klik for at markere dette svar som korrekt`;

  return inputFieldContainer;
}

function addKeywordElements(questionContainer) {
  const allKeywordsContainer = appendDomNode(`DIV`, questionContainer, undefined, [{ class: `allKeywordsContainer` }]);
  const addKeywordButton = appendDomNode(`BUTTON`, questionContainer, `Tilføj keyword`);

  createInputField(allKeywordsContainer, `Keyword`, 1);
  addKeywordButton.addEventListener(`click`, () => {
    createInputField(allKeywordsContainer, `Keyword`, 1);
  });
}
