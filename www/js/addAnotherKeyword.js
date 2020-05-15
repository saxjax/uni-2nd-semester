/* eslint no-undef: 0 */
// Test her: http://localhost:3000/post/questions?titleEvaluation=Test (Der kan ikke submittes)

const allKeywordsContainer = document.getElementById(`allKeywordsContainer`);
const addKeywordBtn = document.getElementById(`addKeywordBtn`);
let keywordCount = 0;

addKeywordBtn.addEventListener(`click`, () => {
  createKeywordField(allKeywordsContainer);
});

createKeywordField(allKeywordsContainer); // Sørger for at der altid er et keyword indsat
function createKeywordField(appendToThis) {
  keywordCount++;
  const keywordContainer = appendDomNode(`DIV`, appendToThis, undefined, [{ class: `keywordContainer` }]);
  const keywordLabel = appendDomNode(`LABEL`, keywordContainer, `Keyword:`);
  keywordLabel.htmlFor = `keyword${keywordCount}`;
  appendDomNode(`INPUT`, keywordContainer, `Indtast keyword her`, [{ class: `keywordInput` }, { id: `keyword${keywordCount}` }]);
  const removeKeywordBtn = appendDomNode(`BUTTON`, keywordContainer, `X`, [{ class: `removeKeywordBtn` }, { class: `btn` }, { class: `btn-danger` }]);
  removeKeywordBtn.addEventListener(`click`, () => {
    if (allKeywordsContainer.children.length > 1) {
      keywordContainer.remove();
    }
    else {
      displayErrorMessage(allKeywordsContainer, `Du skal indtaste mindst et keyword.`);
    }
  });
  return keywordContainer;
}

function displayErrorMessage(container, message) {
  const messageNode = appendDomNode(`P`, container, `Fejl! ${message}`);
  messageNode.style.color = `red`;
  setTimeout(() => {
    messageNode.remove();
  }, 5000);
}
