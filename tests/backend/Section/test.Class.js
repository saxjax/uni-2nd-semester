const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Section } = require(`../../../node/Section/Section.js`);
let actual = true;
let expected = true;
let object = new Section();

test(`Test af Section klassen i node/Section`, (assert) => {
  assert.equal(actual, expected, `Testen skulle gerne være oprettet.`);

  object = new Section();
  actual = object.name;
  expected = `Section`;

  assert.equal(actual, expected, `{Forventet: ${expected} Reel: ${actual}} Klassen skulle gerne have navn efter sig selv`);

  assert.end();
});
