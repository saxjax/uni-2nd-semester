const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Document } = require(`../../../node/Document/Document.js`);

let request = {'body':{}};
let actual = true;
let expected = true;
let object = new Document(request);

test(`Test af Document Klassen i node/Document`, (assert) => {
  assert.equal(actual, expected, `Testen skulle gerne være oprettet.`);

  request = {'body':{}};
  object = new Document(request);
  actual = object.name;
  expected = `Document`;

  assert.equal(actual, expected, `{Forventet: ${expected} Reel: ${actual}} Klassen skulle gerne have navn efter sig selv`);

  assert.end();
});
