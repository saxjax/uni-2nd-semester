async function calculateCurrentProgress() {
  const takenBar = document.getElementById(`taken`);
  const correctBar = document.getElementById(`correct`);
  let takenVal = 0;
  let correctVal = 0;

  const progress = await getTakenProgress();
  takenVal = progress.totalProgress;
  correctVal = progress.correctProgress;
  if (takenVal === 0) {
    takenBar.innerHTML = `Ingen data at beregne endnu`;
    takenBar.style.width = `100%`;
  }
  else {
    takenBar.innerHTML = `${takenVal}%`;
    takenBar.style.width = `${takenVal}%`;
  }

  if (correctVal === 0) {
    correctBar.innerHTML = `Ingen data at beregne endnu`;
    correctBar.style.width = `100%`;
  }
  else {
    correctBar.innerHTML = `${correctVal}%`;
    correctBar.style.width = `${correctVal}%`;
  }
}

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
