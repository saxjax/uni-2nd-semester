/* eslint no-undef: 0 */

// const form = document.getElementById(`quizQuestionsForm`); FIXME: Slettes hvis ikke den skal bruges
const addAnotherQuestionButtons = document.querySelectorAll(`.addAnotherQuestionButton`);
const submitButton = document.getElementById(`submit`);
const questionCountDisplay = document.getElementById(`questionCountDisplay`);
let questionCount = 1;

// ON LOAD //
// Includes quiz name in quizTitleHeader
const urlParams = new URLSearchParams(window.location.search);
const titleEvaluation = urlParams.get(`titleEvaluation`);
const evaluationTitleHeader = document.getElementById(`quizTitleHeader`);
evaluationTitleHeader.innerHTML = `Create new questions for ${titleEvaluation}`;

addAnotherQuestion(); // Tilføjer automatisk et spørgsmål, når htmlen er loadet.
// /ON LOAD //

addAnotherQuestionButtons.forEach((button) => {
  button.addEventListener(`click`, addAnotherQuestion);
});

function addAnotherQuestion() {
  const questionContainer = insertDomNode(`DIV`, submitButton, undefined, [{ class: `questionContainer` }]);
  const questionLabel = appendDomNode(`LABEL`, questionContainer, `Question ${questionCount}`); // Indsæt label for="someID"
  questionLabel.htmlFor = `question${questionCount}`; // Corresponds to the input.id
  appendDomNode(`BR`, questionContainer);
  const questionInput = appendDomNode(`INPUT`, questionContainer, undefined, [{ id: `question${questionCount}` }, { class: `questionInput` }]);
  const keywordInput = appendDomNode(`INPUT`, questionContainer, undefined, [{ id: `keyword${questionCount}` }, { class: `keywordInput` }]);
  keywordInput.placeholder = `Keyword ${questionCount}`;
  keywordInput.name = `keyword${questionCount}`;
  questionInput.placeholder = `Question ${questionCount}`;
  questionInput.name = `question${questionCount}`;
  appendDomNode(`BR`, questionContainer);
  const breakBeforeAnswerButton = appendDomNode(`BR`, questionContainer);
  const addAnotherAnswerButton = appendDomNode(`BUTTON`, questionContainer, `Add another answer`);
  let answerFieldCount = 1;
  addAnotherAnswerButton.addEventListener(`click`, () => {
    answerFieldCount = createAnswerFields(1, breakBeforeAnswerButton, answerFieldCount);
  });
  answerFieldCount = createAnswerFields(2, breakBeforeAnswerButton, answerFieldCount);
  questionCountDisplay.innerText = `Number of questions: ${questionCount}`;
  questionCount++;
}

function createAnswerFields(amount, createBeforeThisElem, answerFieldCount) {
  let count = answerFieldCount;
  for (let i = 0; i < amount; i++) {
    createAnswerField(createBeforeThisElem, count++);
  }
  return count;
}

function createAnswerField(createBeforeThisElem, answerFieldCount) {
  const correctAnswerCheckbox = insertDomNode(`INPUT`, createBeforeThisElem, undefined, [{ class: `correctAnswerCheckbox` }]);
  correctAnswerCheckbox.type = `checkbox`;
  correctAnswerCheckbox.title = `Click to mark as correct answer`;
  correctAnswerCheckbox.name = `Question${questionCount}AnswerCheckbox${answerFieldCount}`;
  const answerInput = insertDomNode(`INPUT`, createBeforeThisElem, undefined, [{ class: `answerInput` }]);
  answerInput.placeholder = `Answer ${answerFieldCount}`;
  answerInput.name = `Question${questionCount}Answer${answerFieldCount}`;
}
