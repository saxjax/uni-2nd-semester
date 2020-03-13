const basicTest = require(`tape`);
const { addTwo } = require(`../../../node/calculation.js`);

basicTest(`Funktionen addTwo i node/calculation.js`, (assert) => {
  const expected = 5;
  const actual = addTwo(3);

  assert.equal(actual, expected,
    `Funktionen skulle gerne kunne lægge to til et vilkårligt tal`);

  assert.end();
});

basicTest(`Funktionen addTwo i node/calculation.js`, (assert) => {
  const expected = 15;
  const actual = addTwo(`13`);

  assert.equal(actual, expected,
    `Funktionen skulle gerne kunne omdanne en streng til det tilsvarende tal`);

  assert.end();
});
