const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);

const { addTwo } = require(`../../../node/calculation/calculation.js`);

test(`Kravsspecifikationen node/calculation/calculation.js`, (assert) => {
  const actual = true;

  assert.true(actual, `Specifikation 0`);

  assert.end();
});

test(`Funktionen addTwo i node/calculation/calculation.js`, (assert) => {
  const expected = 5;
  const actual = addTwo(3);

  assert.equal(actual, expected,
    `Specifikation 1`);

  assert.end();
});

test(`Funktionen addTwo i node/calculation/calculation.js`, (assert) => {
  const expected = 15;
  const actual = addTwo(`13`);

  assert.equal(actual, expected,
    `Specifikation 2`);

  assert.end();
});
