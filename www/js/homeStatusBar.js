const progressBar = document.querySelector(`.progress-bar`);
const progress = calculateCurrentProgress();

progressBar.innerHTML = `${progress}%`;

progressBar.style.width = `${progress}%`;

function calculateCurrentProgress() {
  // This function should calculate the progress for the user
  // It returns a number between 0 and 100%

  // Logic and grabbing from the database!

  return 50;
}
