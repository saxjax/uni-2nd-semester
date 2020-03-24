/* Tests */
/* Start Template **************************************************** */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Navn } = require(`../../../node/mapper/til/dinFil.js`);

let request = { body: {} };
let actual = true;
let expected = true;
let object = new Navn(request);

test(`Test af X i node/objektNavn`, (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  /* Indsæt konstanter, variable og asserts her */

  assert.end();
});

/* Backend Templates ********************************************** */
/* Functions ********************************************** */
test(`Kopier det nedenunder ind i Start Templaten`, (assert) => {
  expected = `forventet output`;
  actual = Navn(`par/s`);

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Funktionen skal kunne X`);
});

/* Class Methods ******************************************************** */
test(`Kopier det nedenunder ind i Start Templaten`, (assert) => {
  request = { body: {} };
  expected = `forventet output`;
  object = new Navn(request);
  actual = object.someMethod(`par/s`);

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne X`);
});

/* Async Functions **************************************************** */
test(`Kopier det nedenunder ind i Start Templaten`, async (assert) => {
  expected = `forventet output`;
  try {
    actual = await Navn(`par/s`);
    assert.equal(actual, expected,
      `{Forventet: ${expected} Reel: ${actual}} Async Funktionen skal kunne X`);
  }
  catch (error) {
    assert.false(false, `Async Funktionen resolvede ikke, men catchede: ${error}`);
  }
});

/* Promise **************************************************** */
test(`Kopier det nedenunder ind i Start Templaten`, (assert) => {
  expected = `forventet output`;

  return Navn(`par/s`)
    .then((actual) => assert.equal(actual, expected,
      `{Forventet: ${expected} Reel: ${actual}} Promiset skal kunne X`))
    .catch((error) => assert.false(false, `Promiset resolvede ikke, men catchede ${error}`));
});

/* Kilder **************************************************************** */
// Tape:              https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4
// Tape-Promise:      https://github.com/jprichardson/tape-promise
