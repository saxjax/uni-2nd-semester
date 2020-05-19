/* eslint no-undef: 0 */

class Evaluation {
  constructor(form) {
    this.evaluationTitle = form.querySelector(`#evaluationTitle`).value;
    this.selectSection = form.querySelector(`#selectSection`).value;
    this.keywords = this.getKeywords();
  }

  getKeywords() {
    const keywordsArray = [];
    const allKeywordsContainer = document.getElementById(`allKeywordsContainer`);
    const keywordInputs = allKeywordsContainer.getElementsByTagName(`INPUT`);
    for (let i = 0; i < keywordInputs.length; i++) {
      keywordsArray.push(keywordInputs[i].value);
    }
    return keywordsArray;
  }
}

document.getElementById(`submitButton`).addEventListener(`click`, async () => {
  const evaluationForm = document.getElementById(`evaluationForm`);
  const response = await fetch(`/post/evaluation`, {
    method: `POST`,
    body: JSON.stringify(new Evaluation(evaluationForm)),
    headers: { "Content-Type": `application/json` },
  });
  const responseJSON = await response.json();
  if (responseJSON.error) {
    alert(responseJSON.error);
  }
  else {
    window.location.replace(responseJSON.url);
  }
});
