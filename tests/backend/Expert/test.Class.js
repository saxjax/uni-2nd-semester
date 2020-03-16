const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Expert } = require(`../../../node/Expert/Expert.js`);
let actual = true;
let expected = true;
let object = new Expert();

test(`Test af Expert Klassen i node/Expert`, (assert) => {
  assert.equal(actual, expected, `Testen skulle gerne være oprettet.`);

  actual = true;
  expected = true;
  object = new Expert();
  assert.equal(object.name, object.name, `Ny test`);

  assert.end();
});
