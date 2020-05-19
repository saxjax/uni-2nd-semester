/* For at scriptet virker kræves det at createKeywordField.js er loadet inden dennne fil */

/* eslint no-undef: 0 */

const allKeywordsContainer = document.getElementById(`allKeywordsContainer`);
createInputField(allKeywordsContainer, `Keyword`, 1); // Sørger for at der altid er et keyword indsat
document.getElementById(`addKeywordBtn`).addEventListener(`click`, () => {
  createInputField(allKeywordsContainer, `Keyword`, 1); // Fra addAnotherKeyword.js
});
