/* eslint no-console: off */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { SpacedRepetition } = require(`../../../node/Models/ `);

let request = { body: {} };
let actual = true;
let expected = true;
let object = new Navn(request);

/* Test af Funktioner */


test(`Kopier det nedenunder ind i Start Templaten`, async (assert) => {
  const SP = new SpacedRepetition();
  actual = SP.getTasksForRepetition();
  console.log(actual);
  expected = `forventet output`;
  actual = Navn(`vars`);

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne X`);
});
