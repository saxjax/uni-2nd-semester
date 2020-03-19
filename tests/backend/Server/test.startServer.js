const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Server } = require(`../../../node/Server/Server.js`);
let actual = true;
let expected = true;
let object = new Server(`Test`);

test(`Test af startServer i node/Server`, (assert) => {
  assert.equal(actual, expected, `Testen skulle gerne være oprettet.`);

  object = new Server(`TestBesked`);
  const serverStart = object.startServer();

  assert.true(serverStart, `Metoden skal kunne starte og slukke`);
  serverStart.close();

  expected = 3000;
  object = new Server(`TestBesked`);
  actual = object.port;

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne start på port 3000`);

  assert.end();
});
