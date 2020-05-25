/* nodemon tests/backend/Database/test.Model.js | .\node_modules\.bin\tap-spec */
/* eslint no-console: off */
/* eslint no-await-in-loop: 0 */

const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;

const test = testDecorater(tape);
const { Model } = require(`../../../node/Models/AbstractClasses/Model`);

let actual = true;
const expected = true;
let notExpected = true;
const object = new Model();
const emptyRowPacket = [{ RowDataPacket: {} }];
let req = {
  method: `get`,
  session: `foo`,
  params: `bar`,
  body: {
    foo: `bar`,
    bar: `foo`,
  },
};
const unmodifiedReq = req;
let M = 0; // Test counter: En pr. metode
let t = 0; // Test counter: En pr. test for hver metode

/* Input: Intet, men bruger "object" variablen globalt.
 * Output: Har som sideeffect at gendanne tabellen til sine oprindelige værdier.
 * Formål: Kaldes i slutningen af testen for at gendanne værdierne.
 *         Dette gør at testen er fuldstændig selvstændig i sine tests.
 */

test(`Test af Model Klassen i node/Database`, async (assert) => {
  assert.equal(actual, expected, `Model testen skulle gerne være oprettet med variablene actual og expected.`);

  object.debug = false; // sættes til false, da vi i tests ikke er interesseret i run-time fejlbeskeder
  /* 1.1 */
  console.log(`${++M}: Model skal kunne få fat i en klasses UUID.`);
  try {
    actual = await object.getUuid();
  }
  catch (err) {
    actual = emptyRowPacket;
  }
  notExpected = emptyRowPacket;

  assert.isNotDeepEqual(actual, notExpected,
    `(${M}.${++t}) {Databasens svar: ${actual}} Forventede at få noget data, som ikke er en tom RowDataPacket.`);

  console.log(`${++M}: Model skal kunne tjekke om et request er valid.`); t = 0;

  actual = object.validRequest(req);
  assert.true(actual,
    `(${M}.${++t}) {Databasens svar: ${actual}. Forventede ${true}} Forventede at vores "test req" var et valid request.`);

  const objKeys = Object.keys(req);
  objKeys.forEach((objKey) => {
    req[objKey] = undefined;
    actual = object.validRequest(req);
    assert.true(!actual,
      `(${M}.${++t}) {Databasens svar: ${actual}. Forventede ${!true}} Forventede at vores "test req" IKKE var et valid request da req.${objKey} = ${req[objKey]}.`);
    req = unmodifiedReq;
  });

  object.connect.end();
  assert.end();
});
