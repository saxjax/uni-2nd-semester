const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Database } = require(`../../../node/Database/Database.js`);

let actual = true;
let expected = true;
let object = new Database();

/* Dokumentation */
/* 
 * Database objektet stiller alle manipulationer af databasen til rådighed for modeller (dvs. Ikke controllere!) 
 * Databasen er designet efter et REST princip, som betyder at databasen skal kunne:
 * get    (dvs. få allerede gemte data fra databasen)
 * post   (dvs. oprette nye elementer i databasen)
 * put    (dvs. manipulere med data i databasen)
 * delete (dvs. slette elementer i databasen)
 * 
 * API'en som Databasen stiller til rådighed, skal være let tilgængelig.
 * 
 * Ud fra disse krav, opstilles der følgende kravsspecifikationer der skal testes for:
 *
 * Database adgang
 * 1.1 : Databasen skal have adgang til SQL databasen.
 * API Information
 * 2.1 : Databasen skal have en informations metode til hvordan den bruges
 * Databasens Format
 * 3.1 : Databasen skal have et uniformt format for alle queries
 * 3.2 : Databasen skal kunne omskrive formattet til en valid SQL streng efter metodevalg
 * 3.3 : Databasen skal give en fejlmeddelse, hvis en query ikke følger formattet.
 * Get metoden
 * 4.1 : Databasen skal kunne hente 1 specifikt datapunkt fra databasen
 * 4.2 : Databasen skal kunne hente 1 row af data fra database
 * 4.3 : Databasen skal kunne hente 1 column af data fra databasen
 * 4.4 : Databasen skal kunne hente en serie af rows fra databasen
 * 4.5 : Databasen skal kunne hente en serie af columns fra databasen
 * 4.6 : Databasen skal kunne hente en hel tabel fra databasen
 * 4.7 : Databasen skal kunne give en fejlmeddelse, hvis dataene ikke kan hentes
 * Post Metoden
 * 5.1 : Databasen skal kunne oprette en ny row i databasen ud fra fuldstændig information
 * 5.2 : Databasen skal kunne oprette en ny row i databasen ud fra ufuldstændig information
 * 5.3 : Databasen skal kunne give en fejlmeddelse, hvis dataene ikke er blevet gemt
 * Put Metoden
 * 6.1 : Databasen skal kunne modificere 1 specifikt datapunkt fra databasen
 * 6.2 : Databasen skal kunne modificere 1 row af data fra database
 * 6.3 : Databasen skal kunne modificere 1 column af data fra databasen
 * 6.4 : Databasen skal kunne modificere en serie af rows fra databasen
 * 6.5 : Databasen skal kunne modificere en serie af columns fra databasen
 * 6.6 : Databasen skal kunne modificere en hel tabel fra databasen
 * 6.7 : Databasen skal kunne give en fejlmeddelse, hvis dataene ikke er blevet modificeret
 * Delete Metoden
 * 7.1 : Databasen skal kunne slette en row i databasen
 * 7.2 : Databasen skal kunne slette en column i databasen
 * 7.3 : Databasen skal kunne sætte et element til null
 * 7.4 : Databasen skal kunne give en fejlmeddelse, hvis dataene ikke er blevet slettet
 */

test(`Test af Database Klassen i node/Database`, async function (assert) {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  try {
    object = new Database();
    expected = true;
    await object.connect.connect((err) => {if(err) {throw err}});
    assert.true(expected,
      `(1.1) {Altid true hvis der IKKE sker en error} Databasen skal have adgang til SQL databasen.`);

    expected = true;
    actual = object.info();
    assert.equal(actual, expected,
      `(2.1) {Returnere true hvis info metoden er implementeret} Databasen skal have en informations metode til hvordan den bruges`);

    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(3.1) {Query formattet er pt: ${expected}} Databasen skal have et uniformt format for alle queries`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(3.2.1) {Forventet: ${expected} Reel: ${actual}} (get) Databasen skal kunne omskrive formattet til en valid SQL streng`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(3.2.2) {Forventet: ${expected} Reel: ${actual}} (post) Databasen skal kunne omskrive formattet til en valid SQL streng`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(3.2.3) {Forventet: ${expected} Reel: ${actual}} (put) Databasen skal kunne omskrive formattet til en valid SQL streng`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(3.2.4) {Forventet: ${expected} Reel: ${actual}} (delete) Databasen skal kunne omskrive formattet til en valid SQL streng`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(3.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal give en fejlmeddelse, hvis en query ikke følger formattet.`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(4.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 specifikt datapunkt fra databasen`);

    expected = `test1`;
    expected2 = `test2`;
    actual = await object.get("*",`test_option1 = "test1" AND test_option2 = "test2"`);
    assert.equal(actual[0].test_option1, expected,
      `(4.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 row af data fra database (test1)`);
    assert.equal(actual[0].test_option2, expected2,
      `(4.2) {Forventet: ${expected2} Reel: ${actual}} Databasen skal kunne hente 1 row af data fra database (test2)`);

    expected = 'test1';
    actual = await object.get("test_option1",`test_option1 = "test1" AND test_option2 = "test2"`);
    assert.equal(actual[0].test_option1, expected,
      `(4.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 column af data fra databasen`);

    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(4.4) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(4.5) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(4.6) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(4.7) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne give en fejlmeddelse, hvis dataene ikke kan hentes`);

    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(5.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra fuldstændig information`);

    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(5.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra ufuldstændig information`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(5.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne give en fejlmeddelse, hvis dataene ikke er blevet gemt`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(6.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere 1 specifikt datapunkt fra databasen`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(6.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere 1 row af data fra database`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(6.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere 1 column af data fra databasen`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(6.4) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere en serie af rows fra databasen`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(6.5) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere en serie af columns fra databasen`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(6.6) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere en hel tabel fra databasen`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(6.7) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne give en fejlmeddelse, hvis dataene ikke er blevet modificeret`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(7.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne slette en row i databasen`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(7.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne slette en column i databasen`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(7.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne sætte et element til null`);
    expected = true;
    actual = true;
    assert.equal(actual, expected,
      `(7.4) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne give en fejlmeddelse, hvis dataene ikke er blevet slettet`);
    
    object.connect.end();
  }
  catch (error) {
    assert.false(true, `Database Tests resolvede kun delvist eller slet ikke og catchede:\n ${error}`);
  }

  assert.end();
});
