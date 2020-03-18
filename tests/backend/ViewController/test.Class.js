const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { ViewController } = require(`../../../node/ViewController/ViewController.js`);
let actual = true;
let expected = true;
let object = new ViewController();

test(`Test af ViewController Klassen i node/ViewController`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  actual = true;
  expected = true;
  object = new ViewController();
  assert.equal(object.name, object.name, `Ny test`);

  assert.end();
});
