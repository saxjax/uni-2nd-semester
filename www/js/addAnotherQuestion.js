/* HEAD */

// Indsætter et DOM-element før insBeforeThisElem
function insertDomNode(tagName, insBeforeThisElem, innerHTML, selectors) {
  const node = createDomNode(tagName, innerHTML, selectors);
  insBeforeThisElem.parentNode.insertBefore(node, insBeforeThisElem);
  return node;
}

// Indsætter et DOM-element, som en child til den givne parent
function appendDomNode(tagName, parent, innerHTML, selectors) {
  const node = createDomNode(tagName, innerHTML, selectors);
  parent.appendChild(node);
  return node;
}

function createDomNode(tagName, innerHTML, selectors) {
  const elem = document.createElement(tagName);
  // Apply innerHTML
  switch (tagName) {
    case `p`:
      elem.appendChild(document.createTextNode(innerHTML)); break;
    case `button`: case `label`:
      elem.innerHTML = innerHTML;                           break;
    default:                                                break; // "default" sker når tagName ikke skal have et innerHTML
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

addAnotherQuestion(); // Tilføjer automatisk et spørgsmål, når htmlen er loadet.
buttons.forEach((button) => {
  button.addEventListener(`click`, addAnotherQuestion);
});

function addAnotherQuestion() {
  questionCount++;
  const questionContainer = insertDomNode(`div`, submitButton, undefined, [{ class: `questionContainer` }]); // FIXME: Jacob: Bør dette ikke være en class? Tidligere: id: `div${questionCount}`
  const questionLabel = appendDomNode(`label`, questionContainer, `Question ${questionCount}`); // Indsæt label for="someID"
  questionLabel.htmlFor = `question${questionCount}`;
  appendDomNode(`br`, questionContainer);

  const input = appendDomNode(`input`, questionContainer, undefined, [{ id: `question${questionCount}` }]);
  input.placeholder = `Question ${questionCount}`;
  input.name = `question${questionCount}`;
  appendDomNode(`br`, questionContainer);

  createAnswerFields(questionContainer);

  questionCountDisplay.innerHTML = `Number of questions: ${questionCount}`;
}

function createAnswerFields(questionContainer) {
  for (let i = 1; i <= 4; i++) {
    const inputAnswer = appendDomNode(`input`, questionContainer);
    inputAnswer.placeholder = `Answer ${i}`;
    inputAnswer.name = `Question${questionCount}Answer${i}`;
  }
  const correctAnswer = appendDomNode(`input`, questionContainer);
  correctAnswer.type = `Number`;
  correctAnswer.placeholder = `Correct answer`;
  correctAnswer.min = `1`;
  correctAnswer.max = `4`;
  correctAnswer.id = `correctAnswerQuestion${questionCount}`;
}
