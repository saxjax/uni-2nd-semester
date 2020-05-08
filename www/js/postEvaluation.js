/* eslint no-undef: 0 */

class Evaluation {
  constructor(form) {
    this.evaluationTitle = form.querySelector(`#evaluationTitle`).value;
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

const addKeywordButton = document.getElementById(`addKeywordButton`);
let keywordNum = 1;
addKeywordButton.addEventListener(`click`, addKeywordField);

addKeywordField();
function addKeywordField() {
  const keywordInputField = insertDomNode(`INPUT`, addKeywordButton, `Keyword ${keywordNum}`, [{ class: `keywordInputField` }, { id: `keywordField${keywordNum}` }]);
  insertDomNode(`LABEL`, keywordInputField, `Keyword ${keywordNum}:`).htmlFor = `keywordField${keywordNum}`;
  insertDomNode(`BR`, addKeywordButton);
  keywordNum++;
}

const submitButton = document.getElementById(`submitButton`);
submitButton.addEventListener(`click`, postEvaluation);

async function postEvaluation() {
  const evaluationForm = document.getElementById(`evaluationForm`);
  const evaluation = new Evaluation(evaluationForm);
  const response = await fetch(`/post/evaluation`, {
    method: `POST`,
    body: JSON.stringify(evaluation),
    headers: { "Content-Type": `application/json` },
  });
  const responseJSON = await response.json();
  window.location.replace(responseJSON.url);
}
