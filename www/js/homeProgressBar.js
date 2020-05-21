/* Formål: Indsætter procentuelle værdier til progress baren på homescreen */
async function calculateCurrentProgress() {
  const takenBar = document.getElementById(`taken`);
  const takenBarWidth = document.getElementById(`takenWidth`);
  const correctBar = document.getElementById(`correct`);
  const correctBarWidth = document.getElementById(`correctWidth`);
  let takenVal = 0;
  let correctVal = 0;

  const progress = await getTakenProgress();
  takenVal = Math.round(progress.totalProgress);
  correctVal = Math.round(progress.correctProgress);

  // Progressbar for gennemgåede evalueringer
  if (takenVal === 0) {
    takenBar.innerHTML = `Du har ikke taget nogen evalueringer endnu`;
    takenBarWidth.style.width = `100%`;
    correctBar.innerHTML = `Du har ikke taget nogen evalueringer endnu`;
    correctBarWidth.style.width = `100%`;
  }
  else {
    takenBar.innerHTML = `${takenVal}%`;
    takenBarWidth.style.width = `${takenVal}%`;
    correctBar.innerHTML = `${correctVal}%`;
    correctBarWidth.style.width = `${correctVal}%`;
  }
}

/* Formål: Sender et GET til serveren, som spørger om evaluerings data for en pågældende bruger
*  Output: JSON object med procent data.
*/
async function getTakenProgress() {
  let progress;
  const response = await fetch(`/view/evaluationProgress`, {
    method: `GET`,
    headers: { "Content-Type": `application/json` },
  });
  const responseJSON = await response.json();
  if (responseJSON.error) {
    alert(responseJSON.error);
  }
  else {
    progress = responseJSON;
  }
  return progress;
}

calculateCurrentProgress();
