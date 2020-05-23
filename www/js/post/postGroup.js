class Group {
  constructor(formContainer) {
    this.name    = formContainer.querySelector(`#name`).value;
    this.members = this.getMembers(formContainer);
  }

  /* Formål: Gemmer alle usernames fra HTML input fælterne
  *  Input : Container med bruger input.
  *  Output: Array af usernames.
  */
  getMembers(formContainer) {
    const members = [];
    const memberInputs = formContainer.getElementsByClassName(`medlemInput`);
    for (let i = 0; i < memberInputs.length; i++) {
      if (memberInputs[i].value !== ``) {
        members.push(memberInputs[i].value);
      }
    }
    return members;
  }
}

/* Formål: Poste sectionsdata når brugeren trykker på submit-knappen
   *           efter brugerens section er oprettet i databasen videredirigeres brugeren til en URL, som er bestemt fra serversiden
   * Input : -
   * Output: -
   */
document.getElementById(`submitBtn`).addEventListener(`click`, async () => {
  const formContainer = document.getElementById(`formContainer`);
  const response = await fetch(`/post/group`, {
    method: `POST`,
    body: JSON.stringify(new Group(formContainer)),
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
