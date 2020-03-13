const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);

const { addFour } = require(`../../../node/calculation.js`);

test(`Async Funktionen addFour i node/calculation.js`, async (assert) => {
  const expected = 6;
  const actual = await addFour(2);

  assert.equal(actual, expected,
    `Funktionen skal kunne lægge 4 til en vilkårlig værdi efter 1 sekund`);

  assert.end();
});

test(`Async Funktionen addFour i node/calculation.js`, async (assert) => {
  const expected = 6;
  const actual = await addFour(`2`);

  assert.equal(actual, expected,
    `Funktionen skal kunne omdanne en streng til et tilsvarende tal`);

  assert.end();
});
