const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Section } = require(`../../../node/Section/Section.js`);
let actual = true;
let expected = true;
let object = new Section();

test(`Test af Section klassen i node/Section`, (assert) => {
  assert.equal(actual, expected, `Testen skulle gerne være oprettet.`);

  actual = true;
  expected = true;
  object = new Section();
  assert.equal(object.name, object.name, `Ny test`);

  assert.end();
});
