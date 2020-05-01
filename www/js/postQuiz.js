/* HEAD */
class Quiz {
  constructor(form) {
    this.quizTitle = form.querySelector(`#quizTitle`).value;
    this.selectSection = form.querySelector(`#selectSection`).value;
    this.keywords = this.getKeywords(form);
  }

  getKeywords(form) {
    const keywordsArray = [];
    const keywordsCollection = form.getElementsByClassName(`keywordInputField`);
    for (let i = 0; i < keywordsCollection.length; i++) {
      keywordsArray.push(keywordsCollection[i].value);
    }
    return keywordsArray;
  }
}

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
  // Apply innerHTML
  switch (tagName) {
    case `P`:
      elem.appendChild(document.createTextNode(text)); break;
    case `BUTTON`: case `LABEL`:
      elem.innerHTML = text;                           break;
    case `INPUT`:
      elem.placeholder = text;                         break;
    default:                                           break; // "default" sker når tagName ikke skal have et innerHTML
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

const addKeywordButton = document.getElementById(`addKeywordButton`);
let keywordNum = 1;
addKeywordButton.addEventListener(`click`, addKeywordField);

function addKeywordField() {
  const keywordInputField = insertDomNode(`INPUT`, addKeywordButton, `Keyword ${keywordNum}`, [{ class: `keywordInputField` }, { id: `keywordField${keywordNum}` }]);
  insertDomNode(`LABEL`, keywordInputField, `Keyword ${keywordNum}`).htmlFor = `keywordField${keywordNum}`;
  insertDomNode(`BR`, addKeywordButton);
  keywordNum++;
}

const submitButton = document.getElementById(`submitButton`);
submitButton.addEventListener(`click`, postQuiz);

async function postQuiz() {
  const quizForm = document.getElementById(`quizForm`);
  const quiz = new Quiz(quizForm);
  const response = await fetch(`/post/quiz`, {
    method: `POST`,
    body: JSON.stringify(quiz),
    headers: { "Content-Type": `application/json` },
  });
  window.location.replace(response.url);
}
