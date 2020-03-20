const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Section } = require(`../../../node/Section/Section.js`);

let request = {'body':{}};
let actual = true;
let expected = true;
let object = new Section(request);

test(`Test af Section klassen i node/Section`, (assert) => {
  assert.equal(actual, expected, `Testen skulle gerne være oprettet.`);

  request = {'body':{}};
  object = new Section(request);
  actual = object.name;
  expected = `Section`;

  assert.equal(actual, expected, `{Forventet: ${expected} Reel: ${actual}} Klassen skulle gerne have navn efter sig selv`);

  assert.end();
});
