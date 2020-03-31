/* eslint no-console: off */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Database } = require(`../../../node/Database/Database.js`);

let actualObject = true;
let actual = true;
let expected = true;
let object = new Database();
/* textoff bruges til at slå info() teksten fra diverse fejlmeddelser når de testes */
const textoff = false;

/* Dokumentation */
/*
 * Database objektet stiller alle manipulationer af databasen til rådighed for modeller (dvs. Ikke controllere!)
 * Databasen er designet efter et REST princip, som betyder at databasen skal kunne:
 * get      (dvs. få allerede gemte data fra databasen)
 * post     (dvs. oprette nye elementer i databasen)
 * put      (dvs. manipulere med data i databasen)
 * delete   (dvs. slette elementer i databasen)
 * head     (dvs. få information om resourcerne i SQLdatabasen.)
 * options: (dvs. få information om brugen af databasen og dens resourcer.)
 *
 * KRAVSSPECIFIKATIONER FINDES PÅ OVERLEAF!
 * Se under 4_Design/Database.tex nederst på siden.
 */

/* Denne test gør brug af pregenereret data i MySQL databasen som er:
  *     iddatabase test_option1 test_option2 test_option3 test_option4 test_option5_float
  *     *          test1        test2        test3        null         1
  *     *          test4        test5        test6        null         1.2
  *     *          test7        test8        test9        null         -123
  *
  *    Størstedelen af tests vil foregå på test_option1-3,
  *    hvor test_option4 bruges til at teste funktionaliteter på ikke unikke operationer.
  */
test(`Test af Database Klassen i node/Database`, async (assert) => {
  assert.equal(actual, expected, `Skulle gerne være oprettet.`);

  try {
    object = new Database();
    /* 1.1 */
    expected = true;
    await object.connect.connect((err) => {
      if (err) {
        throw err;
      }
    });
    assert.true(expected,
      `(1.1) {Altid true hvis der IKKE sker en error} Databasen skal have adgang til SQL databasen.`);

    /* 2.1 */
    expected = `SELECT {noget}/UPDATE/INSERT/DELETE & CUSTOM`;
    actual = object.choiceValgmuligheder;
    assert.equal(actual, expected,
      `(2.1) {Query formattet er pt: ${expected}} Databasen skal have et uniformt format for alle queries`);

    /* 2.2 */
    expected = `SELECT * FROM ${object.database}.${object.table} WHERE testfield = "test"`;
    actual = object.parser(`SELECT *`, `testfield = "test"`);
    assert.equal(actual, expected,
      `(2.2.1) {Forventet: ${expected} Reel: ${actual}} (get) Databasen skal kunne omskrive formattet til en valid SQL streng`);

    expected = `INSERT INTO ${object.database}.${object.table} (testfield1, testfield2) VALUES ("test1", "test2")`;
    actual = object.parser(`INSERT`, `testfield1 = "test1" AND testfield2 = "test2"`);
    assert.equal(actual, expected,
      `(2.2.2) {Forventet: ${expected} Reel: ${actual}} (post) Databasen skal kunne omskrive formattet til en valid SQL streng`);

    expected = `UPDATE ${object.database}.${object.table} SET testfield1 = "test2" WHERE testfield1 = "test1"`;
    actual = object.parser(`UPDATE`, `testfield1 = "test2" WHERE testfield1 = "test1"`);
    assert.equal(actual, expected,
      `(2.2.3) {Forventet: ${expected} Reel: ${actual}} (put) Databasen skal kunne omskrive formattet til en valid SQL streng`);

    expected = `DELETE FROM ${object.database}.${object.table} WHERE testfield1 = "test1"`;
    actual = object.parser(`DELETE`, `testfield1 = "test1"`);
    assert.equal(actual, expected,
      `(2.2.4) {Forventet: ${expected} Reel: ${actual}} (delete) Databasen skal kunne omskrive formattet til en valid SQL streng`);

    /* 2.3 */
    try {
      actual = await object.query(`THIS IS NOT A VALID QUERY`, `NO IT IS NOT`, textoff);
      actual = false;
    }
    catch (error) {
      actual = true;
    }
    assert.true(actual,
      `(2.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal give en fejlmeddelse, hvis en query ikke følger formattet.`);

    /* 3.1 */
    actualObject = await object.query(`SELECT test_option1`, `test_option1 = "test1"`);

    expected = `test1`;
    actual = actualObject[0].test_option1;
    assert.equal(actual, expected,
      `(3.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 specifikt datapunkt fra databasen`);

    /* 3.2 */
    actualObject = await object.query(`SELECT *`, `test_option1 = "test1" AND test_option2 = "test2"`);

    expected = `test1`;
    actual = actualObject[0].test_option1;
    assert.equal(actual, expected,
      `(3.2.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 row af data fra database`);

    actual = actualObject[0].test_option2;
    expected = `test2`;
    assert.equal(actual, expected,
      `(3.2.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 row af data fra database`);

    actual = actualObject[0].test_option3;
    expected = `test3`;
    assert.equal(actual, expected,
      `(3.2.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 row af data fra database`);

    /* 3.3 */
    actualObject = await object.query(`SELECT test_option1`);

    expected = `test1`;
    actual = actualObject[0].test_option1;
    assert.equal(actual, expected,
      `(3.3.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 column af data fra databasen`);

    expected = `test4`;
    actual = actualObject[1].test_option1;
    assert.equal(actual, expected,
      `(3.3.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 column af data fra databasen`);

    expected = `test7`;
    actual = actualObject[2].test_option1;
    assert.equal(actual, expected,
      `(3.3.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente 1 column af data fra databasen`);

    /* 3.4 */
    actualObject = await object.query(`SELECT *`, `test_option1 = "test1" OR test_option1 = "test4"`);

    expected = `test1`;
    actual = actualObject[0].test_option1;
    assert.equal(actual, expected,
      `(3.4.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);

    expected = `test2`;
    actual = actualObject[0].test_option2;
    assert.equal(actual, expected,
      `(3.4.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);

    expected = `test3`;
    actual = actualObject[0].test_option3;
    assert.equal(actual, expected,
      `(3.4.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);

    expected = `test4`;
    actual = actualObject[1].test_option1;
    assert.equal(actual, expected,
      `(3.4.4) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);

    expected = `test5`;
    actual = actualObject[1].test_option2;
    assert.equal(actual, expected,
      `(3.4.5) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);

    expected = `test6`;
    actual = actualObject[1].test_option3;
    assert.equal(actual, expected,
      `(3.4.6) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af rows fra databasen`);

    /* 3.5 */
    actualObject = await object.query(`SELECT test_option1, test_option2`);

    expected = `test1`;
    actual = actualObject[0].test_option1;
    assert.equal(actual, expected,
      `(3.5.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);

    expected = `test2`;
    actual = actualObject[0].test_option2;
    assert.equal(actual, expected,
      `(3.5.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);

    expected = `test4`;
    actual = actualObject[1].test_option1;
    assert.equal(actual, expected,
      `(3.5.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);

    expected = `test5`;
    actual = actualObject[1].test_option2;
    assert.equal(actual, expected,
      `(3.5.4) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);

    expected = `test7`;
    actual = actualObject[2].test_option1;
    assert.equal(actual, expected,
      `(3.5.5) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);

    expected = `test8`;
    actual = actualObject[2].test_option2;
    assert.equal(actual, expected,
      `(3.5.6) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en serie af columns fra databasen`);

    /* 3.6 */
    actualObject = await object.query(`SELECT *`);

    expected = `test1`;
    actual = actualObject[0].test_option1;
    assert.equal(actual, expected,
      `(3.6.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test2`;
    actual = actualObject[0].test_option2;
    assert.equal(actual, expected,
      `(3.6.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test3`;
    actual = actualObject[0].test_option3;
    assert.equal(actual, expected,
      `(3.6.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test4`;
    actual = actualObject[1].test_option1;
    assert.equal(actual, expected,
      `(3.6.4) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test5`;
    actual = actualObject[1].test_option2;
    assert.equal(actual, expected,
      `(3.6.5) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test6`;
    actual = actualObject[1].test_option3;
    assert.equal(actual, expected,
      `(3.6.6) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test7`;
    actual = actualObject[2].test_option1;
    assert.equal(actual, expected,
      `(3.6.7) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test8`;
    actual = actualObject[2].test_option2;
    assert.equal(actual, expected,
      `(3.6.8) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    expected = `test9`;
    actual = actualObject[2].test_option3;
    assert.equal(actual, expected,
      `(3.6.9) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente en hel tabel fra databasen`);

    /* 3.7 */
    actualObject = await object.query(`SELECT test_option5_float`);

    expected = 1;
    actual = actualObject[0].test_option5_float;
    assert.equal(actual, expected,
      `(3.7.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente ints og floats fra databasen.`);

    expected = 1.2;
    actual = actualObject[1].test_option5_float;
    assert.equal(actual, expected,
      `(3.7.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente ints og floats fra databasen.`);

    expected = -123;
    actual = actualObject[2].test_option5_float;
    assert.equal(actual, expected,
      `(3.7.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne hente ints og floats fra databasen.`);

    /* 4.1  */
    try {
      await object.query(`INSERT`, `test_option1 = "test10" AND test_option2 = "test11" AND test_option3 = "test12" 
                         AND test_option4 = "ikkeNull" AND test_option5_float = 1.42`);
    }
    catch (error) {
      console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
    }

    actualObject = await object.query(`SELECT *`, `test_option1 = "test10"`);

    expected = `test10`;
    actual = actualObject[0].test_option1;
    assert.equal(actual, expected,
      `(4.1.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra fuldstændig information`);

    actual = actualObject[0].test_option2;
    expected = `test11`;
    assert.equal(actual, expected,
      `(4.1.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra fuldstændig information`);

    actual = actualObject[0].test_option3;
    expected = `test12`;
    assert.equal(actual, expected,
      `(4.1.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra fuldstændig information`);

    /* 4.2 */
    try {
      await object.query(`INSERT`, `test_option1 = "test13" AND test_option2 = "test14"`);
    }
    catch (error) {
      console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
    }

    actualObject = await object.query(`SELECT *`, `test_option1 = "test13"`);

    expected = `test13`;
    actual = actualObject[0].test_option1;
    assert.equal(actual, expected,
      `(4.2.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra ufuldstændig information`);

    expected = `test14`;
    actual = actualObject[0].test_option2;
    assert.equal(actual, expected,
      `(4.2.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra ufuldstændig information`);

    expected = null;
    actual = actualObject[0].test_option3;
    assert.equal(actual, expected,
      `(4.2.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne oprette en ny row i databasen ud fra ufuldstændig information`);

    /* 4.3 */
    try {
      actualObject = await object.query(`INSERT`, `test_option1 = "test1"`, textoff);
      actual = false;
    }
    catch (error) {
      actual = true;
    }
    assert.true(actual,
      `(4.3) Databasen skal kunne give en fejlmeddelse, hvis der gemmes duplikeret data i en unique column`);

    /* 5.1 */
    try {
      await object.query(`UPDATE`, `test_option1 = "test1_modificeret" WHERE test_option1 = "test1"`);
    }
    catch (error) {
      console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
    }
    actualObject = await object.query(`SELECT test_option1`, `test_option1 = "test1_modificeret"`);

    expected = `test1_modificeret`;
    actual = actualObject[0].test_option1;
    assert.equal(actual, expected,
      `(5.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere 1 specifikt datapunkt fra databasen`);

    /* 5.2 */
    try {
      await object.query(`UPDATE`, `test_option1 = "test4_modificeret", test_option2 = "test5_modificeret", test_option3 = "test6_modificeret" 
                          WHERE test_option1 = "test4" AND test_option2 = "test5" AND test_option3 = "test6"`);
    }
    catch (error) {
      console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
    }
    actualObject = await object.query(`SELECT *`, `test_option1 = "test4_modificeret"`);

    expected = `test4_modificeret`;
    actual = actualObject[0].test_option1;
    assert.equal(actual, expected,
      `(5.2.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere 1 row af data fra database`);

    expected = `test5_modificeret`;
    actual = actualObject[0].test_option2;
    assert.equal(actual, expected,
      `(5.2.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere 1 row af data fra database`);

    expected = `test6_modificeret`;
    actual = actualObject[0].test_option3;
    assert.equal(actual, expected,
      `(5.2.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere 1 row af data fra database`);

    /* 5.3 */
    try {
      await object.query(`UPDATE`, `test_option4 = "not null"`);
    }
    catch (error) {
      console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
    }
    actualObject = await object.query(`SELECT test_option4`);

    expected = `not null`;
    actual = actualObject[0].test_option4;
    assert.equal(actual, expected,
      `(5.3.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere en hel column databasen`);

    expected = `not null`;
    actual = actualObject[1].test_option4;
    assert.equal(actual, expected,
      `(5.3.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere en hel column fra databasen`);

    expected = `not null`;
    actual = actualObject[2].test_option4;
    assert.equal(actual, expected,
      `(5.3.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne modificere en hel column fra databasen`);

    /* For at modificere alle værdier tilbage til det oprindelige */
    await object.query(`UPDATE`, `test_option4 = NULL`);
    await object.query(`UPDATE`, `test_option1 = "test1" WHERE test_option1 = "test1_modificeret"`);
    await object.query(`UPDATE`, `test_option1 = "test4" WHERE test_option1 = "test4_modificeret"`);
    await object.query(`UPDATE`, `test_option2 = "test5" WHERE test_option2 = "test5_modificeret"`);
    await object.query(`UPDATE`, `test_option3 = "test6" WHERE test_option3 = "test6_modificeret"`);

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
    try {
      await object.query(`DELETE`, `test_option1 = "test10"`);
    }
    catch (error) {
      console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
    }

    expected = true;
    actualObject = await object.query(`SELECT *`, `test_option1 = "test10"`);
    if (actualObject.length > 0) {
      actual = false;
    }
    else {
      actual = true;
    }
    assert.equal(actual, expected,
      `(6.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne slette en row i databasen`);

    /* Sletter testdata lavede i denne test i databasen */
    await object.query(`DELETE`, `test_option1 = "test13"`);

    try {
      await object.query(`DELETE`, `notATable = "notAValue_mod`, textoff);
      actual = false;
    }
    catch (error) {
      actual = true;
    }
    assert.equal(actual, expected,
      `(6.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne give en fejlmeddelse, hvis dataene der ønskes slettet ikke findes`);

    /* 7.1 */
    try {
      actualObject = await object.query(`HEAD METODEN`);

      expected = `iddatabase`;
      actual = actualObject[0];
      assert.equal(actual, expected,
        `(7.1.1) {Forventet: ${expected} Reel: ${actual}} .1 Databasen skal kunne sende data om hvilke column navne den tilkoblede tabel har.`);

      expected = `test_option1`;
      actual = actualObject[0];
      assert.equal(actual, expected,
        `(7.1.1) {Forventet: ${expected} Reel: ${actual}} .1 Databasen skal kunne sende data om hvilke column navne den tilkoblede tabel har.`);


      expected = `test_option2`;
      actual = actualObject[0];
      assert.equal(actual, expected,
        `(7.1.1) {Forventet: ${expected} Reel: ${actual}} .1 Databasen skal kunne sende data om hvilke column navne den tilkoblede tabel har.`);

      expected = `test_option3`;
      actual = actualObject[0];
      assert.equal(actual, expected,
        `(7.1.1) {Forventet: ${expected} Reel: ${actual}} .1 Databasen skal kunne sende data om hvilke column navne den tilkoblede tabel har.`);

      expected = `test_option4`;
      actual = actualObject[0];
      assert.equal(actual, expected,
        `(7.1.1) {Forventet: ${expected} Reel: ${actual}} .1 Databasen skal kunne sende data om hvilke column navne den tilkoblede tabel har.`);

      expected = `test_option5_float`;
      actual = actualObject[0];
      assert.equal(actual, expected,
        `(7.1.1) {Forventet: ${expected} Reel: ${actual}} .1 Databasen skal kunne sende data om hvilke column navne den tilkoblede tabel har.`);
    }
    catch (error) {
      console.log(`7.1 Head metoden er IKKE implementeret endnu!`);
    }

    /* 8.1 */
    expected = true;
    actual = object.info(textoff);
    assert.equal(actual, expected,
      `(8.1) {Returnere true hvis info metoden er implementeret} Databasen skal have en informations metode til hvordan den bruges`);

    /* 9.1 */
    try {
      actualObject = await object.query(`CUSTOM`, `SELECT test_option1,concat("CustomText",test_option2) as concat,(test_option5_float + 1) as addition FROM p2.database`, textoff);
    }
    catch (error) {
      console.log(`TEST FORKERT IMPLEMENTERET PGA: ${error}`);
    }
    expected = `test1`;
    actual = actualObject[0].test_option1;
    assert.equal(actual, expected,
      `(9.1.1) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne parse ren SQL kode videre til databasen.`);

    expected = `CustomTexttest2`;
    actual = actualObject[0].concat;
    assert.equal(actual, expected,
      `(9.1.2) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne parse ren SQL kode videre til databasen.`);

    expected = 2;
    actual = actualObject[0].addition;
    assert.equal(actual, expected,
      `(9.1.3) {Forventet: ${expected} Reel: ${actual}} Databasen skal kunne parse ren SQL kode videre til databasen.`);
  }
  catch (error) {
    assert.false(true, `Database Tests resolvede kun delvist eller slet ikke og catchede:\n ${error}`);
  }


  object.connect.end();

  assert.end();
});
