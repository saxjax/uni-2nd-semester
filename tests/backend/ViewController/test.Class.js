const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { ViewController } = require(`../../../node/ViewController/ViewController.js`);

let request = {'body':{}};
let actual = true;
let expected = true;
let object = new ViewController(request);

test(`Test af ViewController Klassen i node/ViewController`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  request = {'body':{}};
  object = new ViewController(request);
  actual = object.name;
  expected = `ViewController`;

  assert.equal(actual, expected, `{Forventet: ${expected} Reel: ${actual}} Klassen skulle gerne have navn efter sig selv`);

  assert.end();
});
