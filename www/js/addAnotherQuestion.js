/* HEAD */

// Indsætter et DOM-element før insBeforeThisElem
function insertDomNode(tagName, insBeforeThisElem, text, selectors) {
  const node = createDomNode(tagName, text, selectors);
  insBeforeThisElem.parentNode.insertBefore(node, insBeforeThisElem);
  return node;
}

// Indsætter et DOM-element, som en child til den givne parent
function appendDomNode(tagName, parent, text, selectors) {
  const node = createDomNode(tagName, text, selectors);
  parent.appendChild(node);
  return node;
}

function createDomNode(tagNameParam, text, selectors) {
  const tagName = tagNameParam.toUpperCase();
  const elem = document.createElement(tagName);
  // Apply text
  switch (tagName) {
    case `P`:
      elem.appendChild(document.createTextNode(text)); break;
    case `BUTTON`: case `LABEL`:
      elem.innerHTML = text;                           break;
    default:                                                break; // "default" sker når tagName ikke skal have et text
  }
  // Apply css
  if (selectors) {
    for (let i = 0; i < selectors.length; i++) {
      const selectorType = Object.getOwnPropertyNames(selectors[i])[0]; // Enten "id" eller "class"
      switch (selectorType) {
        case    `id`: elem.id = selectors[i].id;              break;
        case `class`: elem.classList.add(selectors[i].class); break;
        default: throw new Error(`That's not a valid selector type. Only "class" and "id" are available.`);
      }
    }
  }
  return elem;
}

/* BODY */

// const form = document.getElementById(`quizQuestionsForm`); FIXME: Slettes hvis ikke den skal bruges
const buttons = document.querySelectorAll(`.addAnotherQuestionButton`);
const submitButton = document.getElementById(`submit`);
const questionCountDisplay = document.getElementById(`questionCountDisplay`);
let questionCount = 0;

// ON LOAD //
// Includes quiz name in quizTitleHeader
const urlParams = new URLSearchParams(window.location.search);
const titleEvaluation = urlParams.get(`titleEvaluation`);
const evaluationTitleHeader = document.getElementById(`quizTitleHeader`);
evaluationTitleHeader.innerHTML = `Create new questions for ${titleEvaluation}`;

addAnotherQuestion(); // Tilføjer automatisk et spørgsmål, når htmlen er loadet.
// /ON LOAD //

buttons.forEach((button) => {
  button.addEventListener(`click`, addAnotherQuestion);
});

function addAnotherQuestion() {
  questionCount++;
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
  createAnswerFields(questionContainer);
  questionCountDisplay.text = `Number of questions: ${questionCount}`;
}

function createAnswerFields(questionContainer) {
  for (let i = 1; i <= 4; i++) {
    const correctAnswerCheckbox = appendDomNode(`INPUT`, questionContainer, undefined, [{ class: `correctAnswerCheckbox` }]);
    correctAnswerCheckbox.type = `checkbox`;
    correctAnswerCheckbox.title = `Click to mark as correct answer`;
    correctAnswerCheckbox.name = `Question${questionCount}AnswerCheckbox${i}`;
    const answerInput = appendDomNode(`INPUT`, questionContainer, undefined, [{ class: `answerInput` }]);
    answerInput.placeholder = `Answer ${i}`;
    answerInput.name = `Question${questionCount}Answer${i}`;
  }
}
