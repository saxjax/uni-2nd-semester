/* eslint no-undef: 0 */
// Test her: http://localhost:3000/post/questions?titleEvaluation=Test (Der kan ikke submittes)

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

  const questionInputContainer = appendDomNode(`DIV`, questionContainer, undefined, [{ class: `questionInputContainer` }]);
  const questionLabel = appendDomNode(`LABEL`, questionInputContainer, `Question ${questionCount}:`); // Indsæt label for="someID"
  questionLabel.htmlFor = `question${questionCount}`; // Corresponds to the input.id
  const questionInput = appendDomNode(`INPUT`, questionInputContainer, `Question ${questionCount}`, [{ id: `question${questionCount}` }, { class: `questionInput` }]);
  questionInput.name = `question${questionCount}`;

  addAnswerElements(questionContainer);
  addKeywordElements(questionContainer);

  questionCountDisplay.innerText = `Number of questions: ${questionCount}`;
  questionCount += 1;
}

function addAnswerElements(questionContainer) {
  const answersContainer = appendDomNode(`DIV`, questionContainer, undefined, [{ class: `answersContainer` }]);
  const addAnotherAnswerButton = appendDomNode(`BUTTON`, answersContainer, `Add`);
  let answerCount = 0;
  createAnswerField(addAnotherAnswerButton, ++answerCount);
  createAnswerField(addAnotherAnswerButton, ++answerCount);
  addAnotherAnswerButton.addEventListener(`click`, () => {
    createAnswerField(addAnotherAnswerButton, ++answerCount);
  });
  const removeAnswerButton = appendDomNode(`BUTTON`, answersContainer, `Remove`);
  removeAnswerButton.addEventListener(`click`, () => {
    if (answerCount > 2) {
      removeLast(answersContainer, `createAnswerFieldContainer`);
      answerCount--;
    }
    else {
      displayErrorMessage(answersContainer, `You need two or more answers.`);
    }
  });
}

function displayErrorMessage(container, message) {
  const messageNode = appendDomNode(`P`, container, `Error: ${message}`);
  messageNode.style.color = `red`;
  setTimeout(() => {
    messageNode.remove();
  }, 5000);
}

function addKeywordElements(questionContainer) {
  const keywordContainer = appendDomNode(`DIV`, questionContainer, undefined, [{ class: `keywordContainer` }]);
  const addKeywordButton = appendDomNode(`BUTTON`, keywordContainer, `Add`);
  let keywordCount = 0;
  createKeywordField(addKeywordButton, ++keywordCount);
  addKeywordButton.addEventListener(`click`, () => {
    createKeywordField(addKeywordButton, ++keywordCount);
  });
  const removeKeywordButton = appendDomNode(`BUTTON`, keywordContainer, `Remove`);
  removeKeywordButton.addEventListener(`click`, () => {
    if (keywordCount > 1) {
      removeLast(keywordContainer, `createKeywordFieldContainer`);
      keywordCount--;
    }
    else {
      displayErrorMessage(keywordContainer, `You need one or more keywords.`);
    }
  });
}

function createAnswerField(createBeforeThis, answerCount) {
  const createAnswerFieldContainer = insertDomNode(`DIV`, createBeforeThis, undefined, [{ class: `createAnswerFieldContainer` }]);

  const answerLabel = appendDomNode(`LABEL`, createAnswerFieldContainer, `Answer ${answerCount}:`);
  answerLabel.htmlFor = `question${questionCount}answer${answerCount}`;

  const answerInput = appendDomNode(`INPUT`, createAnswerFieldContainer, `Answer ${answerCount}`, [{ class: `answerInput` }, { id: `question${questionCount}answer${answerCount}` }]);
  answerInput.name = `Question${questionCount}Answer${answerCount}`;

  const correctAnswerCheckbox = appendDomNode(`INPUT`, createAnswerFieldContainer, undefined, [{ class: `correctAnswerCheckbox` }]);
  correctAnswerCheckbox.type = `checkbox`;
  correctAnswerCheckbox.title = `Click to mark as correct answer`;
  correctAnswerCheckbox.name = `Question${questionCount}AnswerCheckbox${answerCount}`;

  return createAnswerFieldContainer;
}

function removeLast(container, className) {
  const elements = container.getElementsByClassName(className);
  container.removeChild(elements[elements.length - 1]);
}

function createKeywordField(createBeforeThis, keywordCount) {
  const createKeywordFieldContainer = insertDomNode(`DIV`, createBeforeThis, undefined, [{ class: `createKeywordFieldContainer` }]);
  const keywordLabel = appendDomNode(`LABEL`, createKeywordFieldContainer, `Keyword ${keywordCount}:`);
  keywordLabel.htmlFor = `question${questionCount}keyword${keywordCount}`;
  appendDomNode(`INPUT`, createKeywordFieldContainer, `Keyword ${keywordCount}`, [{ class: `keywordInput` }, { id: `question${questionCount}keyword${keywordCount}` }]);
  return createKeywordFieldContainer;
}
