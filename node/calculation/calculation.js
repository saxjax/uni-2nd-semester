function addTwo(val) {
  return val + 2;
}

function addThree(val) {
  return val + 3;
}

async function addFour(val) {
  let result;
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(val + 4), 400);
  });
  try {
    result = await promise;
  }
  catch (error) {
    result = error;
  }
  return result;
}

module.exports = {
  addTwo,
  addThree,
  addFour,
};
