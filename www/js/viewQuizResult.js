const questionDivs = document.getElementsByClassName(`questionDiv`);

for (let i = 1; i <= questionDivs.length; i++) {
  console.log(data.evaluation[i - 1].result);
  if (data.evaluation[i - 1].result === `true`) {
    document.querySelector(`#question${i}`).classList.add(`true`);
  }
  else {
    document.querySelector(`#question${i}`).classList.add(`false`);
  }
}
