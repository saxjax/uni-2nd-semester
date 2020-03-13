const basicTest = require(`tape`);
const { addThree } = require(`../../../node/calculation.js`);

basicTest(`Funktionen addThree i node/calculation.js`, (assert) => {
  const expected = 6;
  const actual = addThree(3);

  assert.equal(actual, expected,
    `Funktionen skulle gerne kunne lægge to til et vilkårligt tal`);

  assert.end();
});

basicTest(`Funktionen addThree i node/calculation.js`, (assert) => {
  const expected = 6;
  const actual = addThree(`3`);

  assert.equal(actual, expected,
    `Funktionen skulle gerne kunne omdanne en streng til det tilsvarende tal`);

  assert.end();
});
