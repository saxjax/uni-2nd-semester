const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { User } = require(`../../../node/User/User.js`);
let actual = true;
let expected = true;
let object = new User();

test(`Test af User klassen i node/User`, (assert) => {
  assert.equal(actual, expected, `Testen skulle gerne være oprettet.`);

  object = new User();
  actual = object.name;
  expected = `User`;

  assert.equal(actual, expected, `{Forventet: ${expected} Reel: ${actual}} Klassen skulle gerne have navn efter sig selv`);

  assert.end();
});
