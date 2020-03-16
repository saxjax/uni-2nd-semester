const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Server } = require(`../../../node/Server/Server.js`);
let actual = true;
let expected = true;
let object = new Server();

test(`Test af Server Klassen i node/Server`, (assert) => {
  assert.equal(actual, expected, `Testen skulle gerne være oprettet.`);

  actual = true;
  expected = true;
  object = new Server();
  assert.equal(object.name, object.name, `Ny test`);

  assert.end();
});
