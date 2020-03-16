const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Document } = require(`../../../node/Document/Document.js`);
let actual = true;
let expected = true;
let object = new Document();

test(`Test af Document Klassen i node/Document`, (assert) => {
  assert.equal(actual, expected, `Testen skulle gerne være oprettet.`);

  actual = true;
  expected = true;
  object = new Document();
  assert.equal(object.name, object.name, `Ny test`);

  assert.end();
});
