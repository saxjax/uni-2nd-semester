/* Tests */
/* Start Template **************************************************** */
/* eslint no-console: off */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Navn } = require(`../../../node/mapper/til/dinFil.js`);

let request = { body: {} };
let actual = true;
let expected = true;
let object = new Navn(request);

test(`Test af X i node/objektNavn`, async (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);
  try {
    /* Indsæt konstanter, variable og asserts her */

    object.connect.end();
  }
  catch (error) {
    assert.false(false, `Async Funktionen resolvede ikke, men catchede: ${error}`);
  }

  assert.end();
});

/* Test af Modeller */
/* actualObject bruges til at kalde queries. actual skal bruges til enkeltstående værdier KUN */
let actualObject = true;
/* textoff bruges til at slå info() teksten fra diverse fejlmeddelser når de testes */
const textoff = false;

test(`Kopier det nedenunder ind i Start Templaten`, async (assert) => {
  request = { body: {} };
  expected = `forventet output`;
  object = new Navn(request);
  actualObject = await object.query(`queryMetode`, `optionalQueryWhereStatements`, textoff);
  actual = actualObject[0].tabelNavn;
  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Async Funktionen skal kunne X`);
});

/* Test af Controllere KAN IKKE BRUGES ENDNU DA CONTROLLERE PT IKKE RETURNERE EN VÆRDI! */
test(`Kopier det nedenunder ind i Start Templaten`, (assert) => {
  expected = `forventet output`;
  object = new Navn();
  actual = object.someMethod(`par/s`);

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne X`);
});

/* HERUNDER ER DER KUN GAMLE SAGER!!! */
/* GAMMELT! Se kun i for at få inspiration */
/* Functions ********************************************** */
test(`Kopier det nedenunder ind i Start Templaten`, (assert) => {
  expected = `forventet output`;
  actual = Navn(`par/s`);

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Funktionen skal kunne X`);
});

/* GAMMELT! Se kun i for at få inspiration */
/* Class Methods ******************************************************** */
test(`Kopier det nedenunder ind i Start Templaten`, (assert) => {
  request = { body: {} };
  expected = `forventet output`;
  object = new Navn(request);
  actual = object.someMethod(`par/s`);

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne X`);
});

/* GAMMELT! Se kun i for at få inspiration */
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

/* Kilder **************************************************************** */
// Tape:              https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4
// Tape-Promise:      https://github.com/jprichardson/tape-promise
