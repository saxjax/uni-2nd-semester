class Section {
  constructor(formContainer) {
    this.idDocument = formContainer.querySelector(`#idDocument`).value;
    this.title      = formContainer.querySelector(`#title`).value;
    this.number     = formContainer.querySelector(`#number`).value;
    this.content    = formContainer.querySelector(`#content`).value;
    this.keywords   = this.getKeywords(formContainer);
  }

  getKeywords(formContainer) {
    const keywords = [];
    const keywordsContainer = formContainer.querySelector(`#allKeywordsContainer`);
    const keywordInputs = keywordsContainer.getElementsByTagName(`INPUT`);
    for (let i = 0; i < keywordInputs.length; i++) {
      if (keywordInputs[i].value !== ``) {
        keywords.push(keywordInputs[i].value);
      }
    }
    return keywords;
  }
}

/* Formål: Poste alle sections når brugeren trykker på submit-knappen
   * Input : -
   * Output: Intet - men efter brugerens sections er oprettet i databasen videredirigeres brugeren til en URL, som er bestemt fra serversiden
   */
document.getElementById(`submitBtn`).addEventListener(`click`, async () => {
  const formContainer = document.getElementById(`formContainer`);
  const response = await fetch(`/post/section`, {
    method: `POST`,
    body: JSON.stringify(new Section(formContainer)),
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
