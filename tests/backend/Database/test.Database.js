/* eslint no-console: off */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Database } = require(`../../../node/Models/AbstractClasses/Database.js`);

let actualObject = true;
let actual = true;
let expected = true;
let object = new Database();
/* textoff bruges til at slaa info() teksten fra diverse fejlmeddelser naar de testes */
const textoff = false;

/* Dokumentation */
/*
 * Database objektet stiller alle manipulationer af databasen til raadighed for modeller (dvs. Ikke controllere!)
 * Databasen er designet efter et REST princip, som betyder at databasen skal kunne:
 * get      (dvs. faa allerede gemte data fra databasen)
 * post     (dvs. oprette nye elementer i databasen)
 * put      (dvs. manipulere med data i databasen)
 * delete   (dvs. slette elementer i databasen)
 * head     (dvs. faa information om resourcerne i SQLdatabasen.)
 * options: (dvs. faa information om brugen af databasen og dens resourcer.)
 *
 * Kravsspecifikationer.
 * 1: Database.js skal have adgang til MySQL databasen.
 * 2: Database.js skal kunne omskrive sine parametre til en valid sql streng
 * 3: Database.js skal kunne hente data fra MySQL databasen
 * 4: Database.js skal kunne oprette data til MySQL databasen
 * 5: Database.js skal kunne opdatere data til MySQL databasen
 * 6: Database.js skal kunne slette data fra MySQL databasen
 * 7: Database.js skal kunne give metadata om tabellerne i MySQL databasen
 * 8: Database.js skal kunne give information om hvordan Database.js API fungere
 */

/* Denne test gør brug af pregenereret data i MySQL databasen som er:
 *     ID_DATABASE TEST_OPTION_1 TEST_OPTION_2 TEST_OPTION_3 TEST_OPTION_4 TEST_OPTION_5_FLOAT
 *     *          test1        test2        test3        null         1
 *     *          test4        test5        test6        null         1.2
 *     *          test7        test8        test9        null         -123
 *
 *    Størstedelen af tests vil foregaa paa TEST_OPTION_1-3,
 *    hvor TEST_OPTION_4 bruges til at teste funktionaliteter paa ikke unikke operationer.
 */
/* Input: Intet, men bruger "object" variablen globalt.
 * Output: Har som sideeffect at gendanne tabellen til sine oprindelige værdier.
 * Formål: Kaldes i slutningen af testen for at gendanne værdierne.
 *         Dette gør at testen er fuldstændig selvstændig i sine tests.
 */
async function resetDB() {
  try {
    await object.query(`CUSTOM`, `DELETE FROM ${object.database}.${object.table}`, textoff);
    await object.query(`CUSTOM`, `INSERT INTO ${object.database}.${object.table} 
             (TEST_OPTION_1, TEST_OPTION_2, TEST_OPTION_3, TEST_OPTION_4, TEST_OPTION_5_FLOAT, ELEMENT_TYPE)
              VALUES ("test1", "test2", "test3", NULL, "1", "test")`, textoff);
    await object.query(`CUSTOM`, `INSERT INTO ${object.database}.${object.table} 
              (TEST_OPTION_1, TEST_OPTION_2, TEST_OPTION_3, TEST_OPTION_4, TEST_OPTION_5_FLOAT, ELEMENT_TYPE)
               VALUES ("test4", "test5", "test6", NULL, "1.2", "test")`, textoff);
    await object.query(`CUSTOM`, `INSERT INTO ${object.database}.${object.table} 
               (TEST_OPTION_1, TEST_OPTION_2, TEST_OPTION_3, TEST_OPTION_4, TEST_OPTION_5_FLOAT, ELEMENT_TYPE)
                VALUES ("test7", "test8", "test9", NULL, "-123", "test")`, textoff);
  }
  catch (err) {
    throw (new Error(`Databasen er IKKE opsat korrekt! Check setupDB i Databasens tests`));
  }
}

test(`Test af Database Klassen i node/Database`, async (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  object = new Database();
  /* 1.1 */
  console.log(`1: Databasen skal have adgang til MySQL databasen.`);
  try {
    await object.connect.connect(async (err) => {
      if (err) {
        throw err;
      }
    });
    actual = true;
  }
  catch (err) {
    actual = false;
  }
  assert.true(actual,
    `(1.1) {Altid true hvis der IKKE sker en error} Databasen skal have adgang til SQL databasen.`);

  await resetDB();

  /* 2.1 */
  console.log(`2: Databasen skal kunne omskrive sine parametre til en valid sql streng`);
  try {
    expected = `SELECT *, ELEMENT_TYPE FROM ${object.database}.${object.table} WHERE testfield = "test"`;
    actual = object.inputParser(`SELECT *`, `testfield = "test"`);
    assert.equal(actual, expected,
      `(2.1.1) (get) Databasen skal kunne omskrive sit input til en valid SQL streng efter metodevalg`);

    expected = `INSERT INTO ${object.database}.${object.table} (testfield1, testfield2, ELEMENT_TYPE) VALUES ("test1", "test2", "test")`;
    actual = object.inputParser(`INSERT`, `testfield1 = "test1" AND testfield2 = "test2"`);
    assert.equal(actual, expected,
      `(2.1.2) (post) Databasen skal kunne omskrive sit input til en valid SQL streng efter metodevalg`);

    expected = `UPDATE ${object.database}.${object.table} SET testfield1 = "test2" WHERE testfield1 = "test1"`;
    actual = object.inputParser(`UPDATE`, `testfield1 = "test2" WHERE testfield1 = "test1"`);
    assert.equal(actual, expected,
      `(2.1.3) (put) Databasen skal kunne omskrive sit input til en valid SQL streng efter metodevalg`);

    expected = `DELETE FROM ${object.database}.${object.table} WHERE testfield1 = "test1"`;
    actual = object.inputParser(`DELETE`, `testfield1 = "test1"`);
    assert.equal(actual, expected,
      `(2.1.4) (delete) Databasen skal kunne omskrive sit input til en valid SQL streng efter metodevalg`);

    expected = `SELECT * FROM information_schema.columns WHERE table_schema = "${object.database}" AND table_name = "${object.table}"`;
    actual = object.inputParser(`HEAD`);
    assert.equal(actual, expected,
      `(2.1.5) (head) Databasen skal kunne omskrive sit input til en valid SQL streng efter metodevalg`);
  }
  catch (err) {
    assert.false(true,
      `(2.1) Resolvede ikke eller kun delvist med fejlen: ${err}`);
  }

  /* 2.2 */
  try {
    actual = await object.query(`THIS IS NOT A VALID QUERY`, `NO IT IS NOT`, textoff);
    actual = false;
  }
  catch (error) {
    actual = true;
  }
  assert.true(actual,
    `(2.2) Databasen skal give en fejlmeddelse, hvis et input ikke kan omskrives til en valid SQL streng.`);

  /* 3.1 */
  console.log(`3: Database.js skal kunne hente data fra MySQL databasen`);
  try {
    actualObject = await object.query(`SELECT TEST_OPTION_1`, `TEST_OPTION_1 = "test1"`);

    expected = `test1`;
    actual = actualObject[0].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 specifikt datapunkt fra databasen`);
  }
  catch (err) {
    assert.false(true,
      `(3.1) Fejlede med den givne fejl: ${err}`);
  }

  /* 3.2 */
  try {
    actualObject = await object.query(`SELECT *`, `TEST_OPTION_1 = "test1" AND TEST_OPTION_2 = "test2"`);

    expected = `test1`;
    actual = actualObject[0].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.2.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 row af data fra database`);

    actual = actualObject[0].TEST_OPTION_2;
    expected = `test2`;
    assert.equal(actual, expected,
      `(3.2.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 row af data fra database`);

    actual = actualObject[0].TEST_OPTION_3;
    expected = `test3`;
    assert.equal(actual, expected,
      `(3.2.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 row af data fra database`);
  }
  catch (err) {
    assert.false(true,
      `(3.2) Fejlede med den givne fejl: ${err}`);
  }

  /* 3.3 */
  try {
    actualObject = await object.query(`SELECT TEST_OPTION_1`);
    expected = `test1`;
    actual = actualObject[0].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.3.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 column af data fra databasen`);

    expected = `test4`;
    actual = actualObject[1].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.3.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 column af data fra databasen`);

    expected = `test7`;
    actual = actualObject[2].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.3.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 column af data fra databasen`);
  }
  catch (err) {
    assert.false(true,
      `(3.3) Fejlede med den givne fejl: ${err}`);
  }

  /* 3.4 */
  try {
    actualObject = await object.query(`SELECT *`, `TEST_OPTION_1 = "test1" OR TEST_OPTION_1 = "test4"`);

    expected = `test1`;
    actual = actualObject[0].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.4.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);

    expected = `test2`;
    actual = actualObject[0].TEST_OPTION_2;
    assert.equal(actual, expected,
      `(3.4.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);

    expected = `test3`;
    actual = actualObject[0].TEST_OPTION_3;
    assert.equal(actual, expected,
      `(3.4.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);

    expected = `test4`;
    actual = actualObject[1].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.4.4) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);

    expected = `test5`;
    actual = actualObject[1].TEST_OPTION_2;
    assert.equal(actual, expected,
      `(3.4.5) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);

    expected = `test6`;
    actual = actualObject[1].TEST_OPTION_3;
    assert.equal(actual, expected,
      `(3.4.6) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);
  }
  catch (err) {
    assert.false(true,
      `(3.4) Fejlede med den givne fejl: ${err}`);
  }

  /* 3.5 */
  try {
    actualObject = await object.query(`SELECT TEST_OPTION_1, TEST_OPTION_2`);

    expected = `test1`;
    actual = actualObject[0].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.5.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);

    expected = `test2`;
    actual = actualObject[0].TEST_OPTION_2;
    assert.equal(actual, expected,
      `(3.5.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);

    expected = `test4`;
    actual = actualObject[1].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.5.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);

    expected = `test5`;
    actual = actualObject[1].TEST_OPTION_2;
    assert.equal(actual, expected,
      `(3.5.4) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);

    expected = `test7`;
    actual = actualObject[2].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.5.5) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);

    expected = `test8`;
    actual = actualObject[2].TEST_OPTION_2;
    assert.equal(actual, expected,
      `(3.5.6) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);
  }
  catch (err) {
    assert.false(true,
      `(3.1) Fejlede med den givne fejl: ${err}`);
  }

  /* 3.6 */
  try {
    actualObject = await object.query(`SELECT *`);

    expected = `test1`;
    actual = actualObject[0].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.6.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test2`;
    actual = actualObject[0].TEST_OPTION_2;
    assert.equal(actual, expected,
      `(3.6.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test3`;
    actual = actualObject[0].TEST_OPTION_3;
    assert.equal(actual, expected,
      `(3.6.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test4`;
    actual = actualObject[1].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.6.4) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test5`;
    actual = actualObject[1].TEST_OPTION_2;
    assert.equal(actual, expected,
      `(3.6.5) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test6`;
    actual = actualObject[1].TEST_OPTION_3;
    assert.equal(actual, expected,
      `(3.6.6) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test7`;
    actual = actualObject[2].TEST_OPTION_1;
    assert.equal(actual, expected,
      `(3.6.7) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test8`;
    actual = actualObject[2].TEST_OPTION_2;
    assert.equal(actual, expected,
      `(3.6.8) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test9`;
    actual = actualObject[2].TEST_OPTION_3;
    assert.equal(actual, expected,
      `(3.6.9) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);
  }
  catch (err) {
    assert.false(true,
      `(3.6) Fejlede med den givne fejl: ${err}`);
  }

  /* 3.7 */
  try {
    actualObject = await object.query(`SELECT TEST_OPTION_5_FLOAT`);
  }
  catch (error) {
    console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
  }

  expected = 1;
  actual = actualObject[0].TEST_OPTION_5_FLOAT;
  assert.equal(actual, expected,
    `(3.7.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente ints og floats fra databasen.`);

  expected = 1.2;
  actual = actualObject[1].TEST_OPTION_5_FLOAT;
  assert.equal(actual, expected,
    `(3.7.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente ints og floats fra databasen.`);

  expected = -123;
  actual = actualObject[2].TEST_OPTION_5_FLOAT;
  assert.equal(actual, expected,
    `(3.7.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente ints og floats fra databasen.`);

  /* 3.8 */
  try {
    actualObject = await object.query(`SELECT *`);
    actual = false;
  }
  catch (error) {
    actual = true;
  }

  expected = `test`;
  actual = actualObject[0].ELEMENT_TYPE;
  assert.true(actual,
    `(3.8.1) Databasen skal ikke kunne hente alt data fra en tabel i et opslag.`);

  /* 3.9 */
  try {
    actualObject = await object.query(`SELECT TEST_OPTION_1`);
  }
  catch (error) {
    console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
  }

  expected = `test`;
  actual = actualObject[0].ELEMENT_TYPE;
  assert.equal(expected, actual,
    `(3.9.1) Det skal fremgå af de data som Databasen henter, hvilken type data der er tale om.`);

  expected = `test`;
  actual = actualObject[0].ELEMENT_TYPE;
  assert.equal(expected, actual,
    `(3.9.2) Det skal fremgå af de data som Databasen henter, hvilken type data der er tale om.`);

  expected = `test`;
  actual = actualObject[0].ELEMENT_TYPE;
  assert.equal(expected, actual,
    `(3.9.3) Det skal fremgå af de data som Databasen henter, hvilken type data der er tale om.`);

  /* 4.1  */
  console.log(`4: Database.js skal kunne oprette data til MySQL databasen`);
  try {
    await object.query(`INSERT`, `TEST_OPTION_1 = "test10" AND TEST_OPTION_2 = "test11" AND TEST_OPTION_3 = "test12" 
                         AND TEST_OPTION_4 = "ikkeNull" AND TEST_OPTION_5_FLOAT = 1.42`);
  }
  catch (error) {
    console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
  }
  try {
    actualObject = await object.query(`SELECT *`, `TEST_OPTION_1 = "test10"`);
  }
  catch (error) {
    console.log(`NEW ERROR ${error}`);
  }

  expected = `test10`;
  actual = actualObject[0].TEST_OPTION_1;
  assert.equal(actual, expected,
    `(4.1.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra fuldstændig information`);

  actual = actualObject[0].TEST_OPTION_2;
  expected = `test11`;
  assert.equal(actual, expected,
    `(4.1.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra fuldstændig information`);

  actual = actualObject[0].TEST_OPTION_3;
  expected = `test12`;
  assert.equal(actual, expected,
    `(4.1.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra fuldstændig information`);

  /* 4.2 */
  try {
    await object.query(`INSERT`, `TEST_OPTION_1 = "test13" AND TEST_OPTION_2 = "test14"`);
  }
  catch (error) {
    console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
  }

  actualObject = await object.query(`SELECT *`, `TEST_OPTION_1 = "test13"`);

  expected = `test13`;
  actual = actualObject[0].TEST_OPTION_1;
  assert.equal(actual, expected,
    `(4.2.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra ufuldstændig information`);

  expected = `test14`;
  actual = actualObject[0].TEST_OPTION_2;
  assert.equal(actual, expected,
    `(4.2.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra ufuldstændig information`);

  expected = null;
  actual = actualObject[0].TEST_OPTION_3;
  assert.equal(actual, expected,
    `(4.2.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra ufuldstændig information`);

  /* 4.3 */
  try {
    actualObject = await object.query(`INSERT`, `TEST_OPTION_1 = "test1"`, textoff);
    actual = false;
  }
  catch (error) {
    actual = true;
  }
  assert.true(actual,
    `(4.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne give en fejlmeddelse, hvis der gemmes duplikeret data i en unique column`);

  /* 4.4 */
  try {
    actualObject = await object.query(`INSERT`, `TEST_OPTION_1 = "test@test.dk"`);
  }
  catch (error) {
    actual = false;
  }
  actual = await object.query(`SELECT TEST_OPTION_1`, `TEST_OPTION_1 = "test@test.dk"`);
  expected = `test@test.dk`;
  assert.equal(actual[0].TEST_OPTION_1, expected,
    `(4.4) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne gemme data med specialtegn (såsom ved emails).`);

  /* 4.5 */
  try {
    actualObject = await object.query(`INSERT`, `TEST_OPTION_1 = "hej med dig"`);
  }
  catch (error) {
    actual = false;
  }
  actual = await object.query(`SELECT TEST_OPTION_1`, `TEST_OPTION_1 = "hej med dig"`);
  expected = `hej med dig`;
  assert.equal(actual[0].TEST_OPTION_1, expected,
    `(4.5) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne gemme data med mellemrum.`);

  /* 4.6 */
  try {
    actualObject = await object.query(`INSERT`, `TEST_OPTION_1 = "hej @ med dig . Og dig = $ tu"`);
  }
  catch (error) {
    actual = false;
  }
  actual = await object.query(`SELECT TEST_OPTION_1`, `TEST_OPTION_1 = "hej @ med dig . Og dig = $ tu"`);
  expected = `hej @ med dig . Og dig = $ tu`;
  assert.equal(actual[0].TEST_OPTION_1, expected,
    `(4.6) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne gemme data med specialtegn der indeholder mellemrum.`);

  /* 4.7 */
  try {
    await object.query(`INSERT`, `TEST_OPTION_1 = "hej @ med dig" `
                           + `AND TEST_OPTION_2 = " . " `
                           + `AND TEST_OPTION_3 = "Og dig = $ tu"`);
  }
  catch (error) {
    actual = false;
  }
  actualObject = await object.query(`SELECT *`, `TEST_OPTION_1 = "hej @ med dig"`);

  actual = actualObject[0].TEST_OPTION_1;
  expected = `hej @ med dig`;
  assert.equal(actual, expected,
    `(4.7.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne gemme flere rows af data med specialtegn der indeholder mellemrum.`);

  actual = actualObject[0].TEST_OPTION_2;
  expected = ` . `;
  assert.equal(actual, expected,
    `(4.7.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne gemme flere rows af data med specialtegn der indeholder mellemrum.`);

  actual = actualObject[0].TEST_OPTION_3;
  expected = `Og dig = $ tu`;
  assert.equal(actual, expected,
    `(4.7.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne gemme flere rows af data med specialtegn der indeholder mellemrum.`);

  /* 5.1 */
  console.log(`5: Database.js skal kunne opdatere data til MySQL databasen`);
  try {
    await object.query(`UPDATE`, `TEST_OPTION_1 = "test1_modificeret" WHERE TEST_OPTION_1 = "test1"`);
  }
  catch (error) {
    console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
  }
  actualObject = await object.query(`SELECT TEST_OPTION_1`, `TEST_OPTION_1 = "test1_modificeret"`);

  expected = `test1_modificeret`;
  actual = actualObject[0].TEST_OPTION_1;
  assert.equal(actual, expected,
    `(5.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere 1 specifikt datapunkt fra databasen`);

  /* 5.2 */
  try {
    await object.query(`UPDATE`, `TEST_OPTION_1 = "test4_modificeret", TEST_OPTION_2 = "test5_modificeret", TEST_OPTION_3 = "test6_modificeret" 
                        WHERE TEST_OPTION_1 = "test4" AND TEST_OPTION_2 = "test5" AND TEST_OPTION_3 = "test6"`);
  }
  catch (error) {
    console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
  }
  actualObject = await object.query(`SELECT *`, `TEST_OPTION_1 = "test4_modificeret"`);

  expected = `test4_modificeret`;
  actual = actualObject[0].TEST_OPTION_1;
  assert.equal(actual, expected,
    `(5.2.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere 1 row af data fra database`);

  expected = `test5_modificeret`;
  actual = actualObject[0].TEST_OPTION_2;
  assert.equal(actual, expected,
    `(5.2.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere 1 row af data fra database`);

  expected = `test6_modificeret`;
  actual = actualObject[0].TEST_OPTION_3;
  assert.equal(actual, expected,
    `(5.2.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere 1 row af data fra database`);

  /* 5.3 */
  try {
    await object.inputParser(`UPDATE`, `TEST_OPTION_1 = "Must Not Happen`, textoff);
    actual = false;
  }
  catch (error) {
    actual = true;
  }
  assert.true(actual,
    `(5.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal give en fejlmeddelse, hvis der ønskes at blive opdateret en kolonne med samme værdi`);

  /* 5.4 */
  try {
    await object.query(`UPDATE`, `notATable = "notAValue_mod" WHERE notATable = "notAValue"`, textoff);
    actual = false;
  }
  catch (error) {
    actual = true;
  }
  assert.true(actual,
    `(5.4) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne give en fejlmeddelse, hvis dataene der ønskes opdateret ikke findes`);

  /* 6.1 */
  console.log(`6: Database.js skal kunne slette data fra MySQL databasen`);
  try {
    await object.query(`DELETE`, `TEST_OPTION_1 = "test10"`);
    expected = true;
    actualObject = await object.query(`SELECT *`, `TEST_OPTION_1 = "test10"`);
    if (actualObject.length > 0) {
      actual = false;
    }
    else {
      actual = true;
    }
    assert.equal(actual, expected,
      `(6.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne slette en row i databasen`);
  }
  catch (err) {
    assert.true(false,
      `(6.1) Ikke fejlede med denne fejl: ${err}`);
  }

  try {
    await object.query(`DELETE`, `notATable = "notAValue_mod`, textoff);
    actual = false;
  }
  catch (error) {
    actual = true;
  }
  assert.equal(actual, expected,
    `(6.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne give en fejlmeddelse, hvis dataene der ønskes slettet ikke findes`);

  /* 6.3 */
  try {
    await object.inputParser(`DELETE`, ``, textoff);
    actual = false;
  }
  catch (error) {
    actual = true;
  }
  assert.equal(actual, expected,
    `(6.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal ikke kunne slette en hel tabel.`);


  /* 7.1 */
  console.log(`7: Database.js skal kunne give metadata om tabellerne i MySQL databasen`);
  try {
    actualObject = await object.query(`HEAD`);
  }
  catch (error) {
    assert.true(false,
      `7.1 Head metoden er implementeret forkert! med fejl: ${error}`);
  }

  expected = `ID_DATABASE`;
  actual = actualObject[0].COLUMN_NAME;
  assert.equal(actual, expected,
    `(7.1.1) {Forventet: ${expected} Reel: ${actual}} .1 Databasen skal kunne sende data om hvilke column navne den tilkoblede tabel har.`);

  expected = `TEST_OPTION_1`;
  actual = actualObject[1].COLUMN_NAME;
  assert.equal(actual, expected,
    `(7.1.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne sende data om hvilke column navne den tilkoblede tabel har.`);

  expected = `TEST_OPTION_2`;
  actual = actualObject[2].COLUMN_NAME;
  assert.equal(actual, expected,
    `(7.1.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne sende data om hvilke column navne den tilkoblede tabel har.`);

  expected = `TEST_OPTION_3`;
  actual = actualObject[3].COLUMN_NAME;
  assert.equal(actual, expected,
    `(7.1.4) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne sende data om hvilke column navne den tilkoblede tabel har.`);

  expected = `TEST_OPTION_4`;
  actual = actualObject[4].COLUMN_NAME;
  assert.equal(actual, expected,
    `(7.1.5) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne sende data om hvilke column navne den tilkoblede tabel har.`);

  expected = `TEST_OPTION_5_FLOAT`;
  actual = actualObject[5].COLUMN_NAME;
  assert.equal(actual, expected,
    `(7.1.6) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne sende data om hvilke column navne den tilkoblede tabel har.`);

  /* 8.1 */
  console.log(`8: Database.js skal kunne give information om hvordan Database.js API fungere`);
  expected = true;
  actual = object.info(textoff);
  assert.equal(actual, expected,
    `(8.1) {Returnere true hvis info metoden er implementeret} Databasen skal have en informations metode til hvordan den bruges`);

  await resetDB(object);

  object.connect.end();

  assert.end();
});
