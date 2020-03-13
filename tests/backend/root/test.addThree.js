const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);

const { addThree } = require(`../../../node/calculation.js`);

test(`Funktionen addThree i node/calculation.js`, (assert) => {
  const expected = 6;
  const actual = addThree(3);

  assert.equal(actual, expected,
    `Funktionen skal kunne lægge tre til et vilkårligt tal`);

  assert.end();
});

test(`Funktionen addThree i node/calculation.js`, (assert) => {
  const expected = 6;
  const actual = addThree(`3`);

  assert.equal(actual, expected,
    `Funktionen skal kunne omdanne en streng til det tilsvarende tal og derefter lægge tre til`);

  assert.end();
});
