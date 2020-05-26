/* Formål: Indsætter procentuelle værdier til progress baren på homescreen */
async function calculateCurrentProgress() {
  const takenBar = document.getElementById(`taken`);
  const takenBarWidth = document.getElementById(`takenWidth`);
  const correctBar = document.getElementById(`correct`);
  const correctBarWidth = document.getElementById(`correctWidth`);
  const questionBar = document.getElementById(`question`);
  const questionBarWidth = document.getElementById(`questionWidth`);
  let takenVal = 0;
  let correctVal = 0;
  let questionVal = 0;

  const progress = await getTakenProgress();
  takenVal = Math.round(progress.totalProgress);
  correctVal = Math.round(progress.correctProgress);
  questionVal = Math.round(progress.questionProgress);

  // Progressbar for gennemgåede evalueringer
  if (takenVal === 0) {
    const noneTakenMessage = `Du har ikke taget nogen evalueringer endnu`;
    takenBar.innerHTML = noneTakenMessage;
    takenBarWidth.style.width = `100%`;
    correctBar.innerHTML = noneTakenMessage;
    correctBarWidth.style.width = `100%`;
    questionBar.innerHTML = noneTakenMessage;
    questionBarWidth.style.width = `100%`;
  }
  else {
    takenBar.innerHTML = `${takenVal}%`;
    takenBarWidth.style.width = `${takenVal}%`;
    correctBar.innerHTML = `${correctVal}%`;
    correctBarWidth.style.width = `${correctVal}%`;
    questionBar.innerHTML = `${questionVal}%`;
    questionBarWidth.style.width = `${questionVal}%`;
  }
}

/* Formål: Sender et GET til serveren, som spørger om evaluerings data for en pågældende bruger
*  Output: JSON object med procent data.
*/
async function getTakenProgress() {
  let progress;
  const response = await fetch(`/api/evaluationProgress`, {
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
