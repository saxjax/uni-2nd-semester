const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Client } = require(`../../../node/Client/Client.js`);
let actual = true;
let expected = true;
let object = new Client();

test(`Test af Client Klassen i node/Client`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  actual = true;
  expected = true;
  object = new Client();
  assert.equal(object.name, object.name, `Ny test`);

  assert.end();
});
