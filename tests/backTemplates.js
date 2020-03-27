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

/* Dokumentation */
/* Indsæt her FORMÅLET med klassen/funktionen
 * Ud fra denne beskrivelse skal det være tydeligt hvad klassen kan, hverken mere eller mindre.
 * Alle kravsspecifikationer vil desuden være direkte relaterbare til hvad der står her
 */

/* Indsæt her KRAVSSPECIFIKATIONERNE der gør at klassens/funktionens formål opfyldes
 * Beskriv ikke metoderne, men formålene, eks:
 * Database adgang
 * 1.1: Klassen skal kunne have adgang til databasen
 * IKKE!!!
 * Connect()
 * 1.1: Connect metoden skal tilkoble databasen
 */

test(`Test af X i node/objektNavn`, async (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);
  try {
    /* Indsæt konstanter, variable og asserts her */
  }
  catch (error) {
    assert.false(false, `Async Funktionen resolvede ikke, men catchede: ${error}`);
  }
  object.connect.end();

  assert.end();
});

/* Test af Modeller */
/* actualObject bruges til at kalde queries. actual skal bruges til enkeltstående værdier KUN */
let actualObject = true;
/* textoff bruges til at slå info() teksten fra diverse fejlmeddelser når de testes */
const texton = false;

test(`Kopier det nedenunder ind i Start Templaten`, async (assert) => {
  request = { body: {} };
  expected = `forventet output`;
  object = new Navn(request);
  actualObject = await object.someMethod(texton);
  actual = actualObject[0].tabelNavn;
  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Async Funktionen skal kunne X`);
});

/* KAN IKKE BRUGES ENDNU DA CONTROLLERE PT IKKE RETURNERE EN VÆRDI!  */
/* Test af Controllere */
test(`Kopier det nedenunder ind i Start Templaten`, async (assert) => {
  expected = `forventet output`;
  object = new Navn();
  actual = object.someMethod(`par/s`);

  assert.equal(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne X`);
});

/* Test af Funktioner */
test(`Kopier det nedenunder ind i Start Templaten`, async (assert) => {
  expected = `forventet output`;
  actual = Navn(`vars`);

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
  expected = `forventet output`;
  actual = Navn(`par/s`);

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
