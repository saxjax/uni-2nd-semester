function calculateCurrentProgress() {
  return Promise((resolve, reject) => {
    // fetch from a "FrontendController" the data for the user
    resolve([]);
    reject({});
  })
    .then((evaluations) => {
      const takenBar = document.querySelector(`taken`);
      const correctBar = document.querySelector(`correct`);
      const takenVal = 50;
      const correctVal = 50;

      for (let i = 0; i < evaluations.length; i++) {
        // calculate amount of taken and amount of correct
      }

      takenBar.innerHTML = `${takenVal}%`;
      takenBar.style.width = `${takenVal}%`;
      correctBar.innerHTML = `${correctVal}%`;
      correctBar.style.width = `${correctVal}%`;
    })
    .catch((error) => {
      console.log(error);
    });
}

calculateCurrentProgress();
