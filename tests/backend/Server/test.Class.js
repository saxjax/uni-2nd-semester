const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Server } = require(`../../../node/Server/Server.js`);
let actual = true;
let expected = true;
let object = new Server(`Test`);

test(`Test af Server Klassen i node/Server`, (assert) => {
  assert.equal(actual, expected, `Testen skulle gerne være oprettet.`);

  object = new Server(`Test`);
  actual = object.name;
  expected = `Server`;

  assert.equal(actual, expected, `{Forventet: ${expected} Reel: ${actual}} Klassen skulle gerne have navn efter sig selv`);

  assert.end();
});
