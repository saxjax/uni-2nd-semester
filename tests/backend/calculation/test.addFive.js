const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);

const { Adder } = require(`../../../node/calculation/calculation.js`);

test(`Kravsspecifikationen node/calculation/calculation.js`, (assert) => {
  const actual = true;

  assert.true(actual, `Specifikation 0`);

  assert.end();
});

test(`Metoden AddFive der tilhører objektet Adder i node/calculation/calculation.js`, (assert) => {
  const expected = 9;
  const object = new Adder(4);
  const actual = object.addFive();

  assert.equal(actual, expected,
    `Specifikation 1 {Forventet: ${expected} Reel: ${actual}}`);

  assert.end();
});

test(`Metoden AddFive der tilhører objektet Adder i node/calculation/calculation.js`, (assert) => {
  const expected = 9;
  const object = new Adder(`4`);
  const actual = object.addFive();

  assert.equal(actual, expected,
    `Specifikation 2 {Forventet: ${expected} Reel: ${actual}}`);

  assert.end();
});
