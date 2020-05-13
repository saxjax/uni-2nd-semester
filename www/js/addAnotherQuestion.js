/* eslint no-undef: 0 */

const addAnotherQuestionButtons = document.querySelectorAll(`.addAnotherQuestionButton`);
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
  const questionContainer = insertDomNode(`DIV`, addAnotherQuestionButtons[1], undefined, [{ class: `questionContainer` }]);
  const questionLabel = appendDomNode(`LABEL`, questionContainer, `Question ${questionCount}`); // Indsæt label for="someID"
  questionLabel.htmlFor = `question${questionCount}`; // Corresponds to the input.id
  appendDomNode(`BR`, questionContainer);
  const questionInput = appendDomNode(`INPUT`, questionContainer, `Question ${questionCount}`, [{ id: `question${questionCount}` }, { class: `questionInput` }]);
  questionInput.name = `question${questionCount}`;
  appendDomNode(`BR`, questionContainer);

  const addAnotherAnswerButton = appendDomNode(`BUTTON`, questionContainer, `+`);
  appendDomNode(`BR`, questionContainer);
  let answerFieldCount = 1;
  addAnotherAnswerButton.addEventListener(`click`, () => {
    answerFieldCount = createAnswerFields(1, addAnotherAnswerButton, answerFieldCount);
  });
  answerFieldCount = createAnswerFields(2, addAnotherAnswerButton, answerFieldCount);

  const addKeywordButton = appendDomNode(`BUTTON`, questionContainer, `+`, [{ id: `addKeywordButton${questionCount}` }]);
  let keywordCount = 0;
  keywordCount += addKeywordField(addKeywordButton, ++keywordCount);
  addKeywordButton.addEventListener(`click`, () => {
    keywordCount += addKeywordField(addKeywordButton, ++keywordCount);
  });

  questionCountDisplay.innerText = `Number of questions: ${questionCount++}`;
}

function addKeywordField(addBeforeThis, keywordCount) {
  const keywordInputField = insertDomNode(`INPUT`, addBeforeThis, `Keyword ${keywordCount}`, [{ class: `keywordInput` }, { id: `keywordField${keywordCount}` }]);
  insertDomNode(`LABEL`, keywordInputField, `Keyword ${keywordCount}:`).htmlFor = `keywordField${keywordCount}`;
  return 1;
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
