
// Inserts a DOM node before the given element
function insertDomNode(tagName, insBeforeThisElem, text, selectors) {
  const node = createDomNode(tagName, text, selectors);
  insBeforeThisElem.parentNode.insertBefore(node, insBeforeThisElem);
  return node;
}

// Appends a DOM node to the given parent
function appendDomNode(tagName, parent, text, selectors) {
  const node = createDomNode(tagName, text, selectors);
  parent.appendChild(node);
  return node;
}

function createDomNode(tagName, text, selectors) {
  const elem = document.createElement(tagName);
  if (selectors) {
    for (const selector of selectors) {
      elem[selector.type] = selector.val;
    }
  }
  switch (tagName) {
    case `p`:      elem.appendChild(document.createTextNode(text)); break;
    case `button`: elem.innerHTML = text;                           break;
    default:                                                        break;
  }
  return elem;
}

const form = document.getElementById(`quizQuestionsForm`);
const buttons = document.querySelectorAll(`.addAnotherQuestionButton`);
const submitButton = document.getElementById(`submit`);
const questionNumDisplay = document.getElementById(`questionNumDisplay`);
let questionNum = 0;

buttons.forEach((button) => {
  button.addEventListener(`click`, addAnotherQuestion);
});

function addAnotherQuestion() {
  createDiv();
  const currentDiv = document.getElementById(`div${questionNum}`);
  const input = document.createElement(`INPUT`);
  const label = document.createElement(`LABEL`);
  label.innerHTML = `Question ${questionNum}`;
  input.placeholder = `Question ${questionNum}`;
  input.name = `question${questionNum}`;
  currentDiv.appendChild(label);
  currentDiv.appendChild(input);
  createAnswerFields(currentDiv);
  questionNum++;
  questionNumDisplay.innerHTML = `Number of questions: ${questionNum}`;
}

function createDiv() {
  const newDiv = document.createElement(`DIV`);
  newDiv.id = `div${questionNum}`;
  form.insertBefore(newDiv, submitButton);
}

function createAnswerFields(currentDiv) {
  for (let i = 0; i < 4; i++) {
    const inputAnswer = document.createElement(`INPUT`);
    inputAnswer.placeholder = `Question${questionNum}Answer${i}`;
    inputAnswer.name = `Question${questionNum}Answer${i}`;
    currentDiv.appendChild(inputAnswer);
    console.log(`Should have`);
  }
  const correctAnswer = document.createElement(`INPUT`);
  correctAnswer.type = `Number`;
  correctAnswer.placeholder = `Correct answer`;
  correctAnswer.min = `1`;
  correctAnswer.max = `4`;
  correctAnswer.id = `correctAnswerQuestion${questionNum}`;
  currentDiv.appendChild(correctAnswer);
}
