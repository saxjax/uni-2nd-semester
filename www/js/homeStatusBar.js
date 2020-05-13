function calculateCurrentProgress() {
  const takenBar = document.getElementById(`taken`);
  const correctBar = document.getElementById(`correct`);
  let takenVal = 0;
  let correctVal = 0;

  for (let i = 0; i < 1; i++) {
    // calculate amount of taken and amount of correct
    takenVal = 50;
    correctVal = 50;
  }

  takenBar.innerHTML = `${takenVal}%`;
  takenBar.style.width = `${takenVal}%`;
  correctBar.innerHTML = `${correctVal}%`;
  correctBar.style.width = `${correctVal}%`;
}

calculateCurrentProgress()
