const basicTest = require(`tape`);
const { addThree } = require(`../../../node/calculation.js`);

basicTest(`Funktionen addThree i node/calculation.js`, (assert) => {
  const expected = 6;
  const actual = addThree(3);

  assert.equal(actual, expected,
    `addThree kaldt på 3 gav ikke: 6`);

  assert.end();
});

basicTest(`Funktionen addThree i node/calculation.js`, (assert) => {
  const expected = 6;
  const actual = addThree(`3`);

  assert.equal(actual, expected,
    `addThree kaldt på "3" gav ikke: 6`);

  assert.end();
});
