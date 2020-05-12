/* eslint no-console: off */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { QuizResult } = require(`../../../node/Models/QuizResult`);

const request = { body: {} };
let actual = true;
let expected = true;


/* Test af Funktioner */


test(`Kopier det nedenunder ind i Start Templaten`, async (assert) => {
  const QR = new QuizResult(request);
  QR.idUser = `553e422d-7c29-11ea-86e2-2c4d54532c7a`;
  QR.idGroup = `34701dd1-7c29-11ea-86e2-2c4d54532c7a`;
  expected = `forventet output`;
  actual = await QR.getTasksforRepetition();

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne X`);
});
