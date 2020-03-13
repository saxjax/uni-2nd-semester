function addTwo(val) {
  return val + 2;
}

function addThree(val) {
  return val + 3;
}

async function addFour(val) {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(val + 4), 400);
  });
  const result = await promise;
  return result;
}

module.exports = {
  addTwo,
  addThree,
  addFour,
};
