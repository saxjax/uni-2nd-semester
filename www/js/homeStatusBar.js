function calculateCurrentProgress() {
  return new Promise((resolve, reject) => {
    // fetch from a "FrontendController" the data for the user
    resolve([`Some Element`]);
  });
}

calculateCurrentProgress()
  .then((evaluations) => {
    console.log(`HEYO`);
    const takenBar = document.getElementById(`taken`);
    const correctBar = document.getElementById(`correct`);

    for (let i = 0; i < evaluations.length; i++) {
      // calculate amount of taken and amount of correct
      const takenVal = 50;
      const correctVal = 50;
    }

    takenBar.innerHTML = `${takenVal}%`;
    takenBar.style.width = `${takenVal}%`;
    correctBar.innerHTML = `${correctVal}%`;
    correctBar.style.width = `${correctVal}%`;
  })
  .catch((error) => {
    console.log(error);
  });
