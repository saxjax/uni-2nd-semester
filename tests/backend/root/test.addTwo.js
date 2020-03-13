const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);

const { addTwo } = require(`../../../node/calculation.js`);

test(`Funktionen addTwo i node/calculation.js`, (assert) => {
  const expected = 5;
  const actual = addTwo(3);

  assert.equal(actual, expected,
    `Funktionen skal kunne lægge to til et vilkårligt tal`);

  assert.end();
});

test(`Funktionen addTwo i node/calculation.js`, (assert) => {
  const expected = 15;
  const actual = addTwo(`13`);

  assert.equal(actual, expected,
    `Funktionen skal kunne omdanne en streng til det tilsvarende tal og derefter lægge tre til`);

  assert.end();
});
