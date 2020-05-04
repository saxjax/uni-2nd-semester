/* eslint no-console: off */
// nodemon tests/backend/Database/test.ParseSQL.js | .\node_modules\.bin\tap-spec

const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const test = testDecorater(tape);
const { ParseSql } = require(`../../../node/Models/AbstractClasses/ParseSQL`);
const { Document } = require(`../../../node/Models/Document`);
const { Section } = require(`../../../node/Models/Section`);
const { Evaluation } = require(`../../../node/Models/Evaluation`);
const { QuizQuestion } = require(`../../../node/Models/QuizQuestion`);
const { Flashcard } = require(`../../../node/Models/Flashcard`);
const { Keyword } = require(`../../../node/Models/Keyword`);
const { KeywordLink } = require(`../../../node/Models/KeywordLink`);
const { User } = require(`../../../node/Models/User`);
const { Group } = require(`../../../node/Models/Group`);

const p = new ParseSql(); // Parseren som er objektet for alle disse test.

/* Dokumentation */
/* ParseSQL er den klasse som sikrer at de data vi får fra MySQL Databasen bliver parset til et JavaScript format (camelCase)
 * Parserens eneste opgave er dermed, at omskrive variabelnavnet som man tilgår data til camelCase, ud fra den elementType dataene er i.
 */

/* Kravsspecifikationer
 * 1: test af parseArrayOfObjects() på data som er ukendt for parseren
 * 2: test af de enkelte parse funktioner
 * 3: test af at parseren kan vurdere ELEMENT_TYPE korrekt
 * 4: Test af at kolonne navnene fra databasen er de samme som parseren forventer
 * 5: For hver elementType hentes tilhørende testelement i databasen vha query() funktionen som henter og parser elementet.
 */

/* Hjælperfunktioner */

/* Formål: At eksplicitere at parserens data skal resettes, så der bliver gjort klart til en ny test
 * Input : Intet, omend der bruges den globale ParseSQL klasse (p)
 * Output: At p.parsedData er lig et tomt array, som hvis der skulle initialiseres en ny klasse.
 */
function resetParsedData() {
  p.parsedData = [];
}

test(`Test af ParseSQL i node/Database`, async (assert) => {
  /* Setup af variable der genbruges */
  // const testData = new TestData(); // Objektet der indeholder de testdata, som Parseren kan teste på.
  let inputData; // Det objekt eller den værdi som skal inputtes i en funktion for at den kan give et testbart output
  let expected;  // Værdien eller objektet som det forventes at actual bliver, når der kaldes en funktion med inputData
  let actual;    // Objektet eller værdien som relatere sig til selve objektet

  /* 1 */
  console.log(`1 Parseren skal kun godtage veldefinere objekter`);
  /* 1.1 */
  resetParsedData();

  inputData = [{ data: `data` }, 1, 0, true, false, `hejse dejsa`];

  try {
    p.parseArrayOfObjects(inputData);
    actual = false;
  }
  catch (err) {
    actual = true;
  }
  assert.true(actual,
    `{1.1 Forventet: ${expected} Reel: ${actual}} Metoden skal meddele en fejl hvis der fås et ukendt objekt`);

  /* 1.2 */
  resetParsedData();

  inputData = [{ ELEMENT_TYPE: `dOkUmEnT` }];

  try {
    p.parseArrayOfObjects(inputData);
    actual = false;
  }
  catch (err) {
    actual = true;
  }
  assert.true(actual,
    `{1.2 Forventet: ${expected} Reel: ${actual}} Metoden skal meddele en fejl hvis der fås et objekt med ukendt elementType`);

  /* 2 */
  console.log(`2 test af at en parse funktion overhovedet kan kaldes`);
  /* 2.1 */
  resetParsedData();

  inputData = {
    ID_DOCUMENT: `TestDataDerSkalParses`,
  };
  expected = `TestDataDerSkalParses`;

  actual = p.parseDocument(inputData).idDocument;

  assert.equal(actual, expected,
    `(2.1){ Metoden skal kunne returnere en parset version af  DOCUMENT-data`);

  /* 2.2 */
  resetParsedData();
  inputData = {
    ID_DOCUMENT_SECTION: `TestDataDerSkalParses`,
  };
  expected = `TestDataDerSkalParses`;

  actual = p.parseSection(inputData).idSection;

  assert.equal(actual, expected,
    `(2.2){ Metoden skal kunne returnere en parset version af  SECTION-data`);

  /* 2.3 */
  resetParsedData();
  inputData = {
    ID_EVALUATION: `TestDataDerSkalParses`,
  };
  expected = `TestDataDerSkalParses`;

  actual = p.parseEvaluation(inputData).idEvaluation;

  assert.equal(actual, expected,
    `(2.3){ Metoden skal kunne returnere en parset version af QUIZ data`);

  /* 2.4 */
  resetParsedData();
  inputData = {
    ID_QUIZ_QUESTION: `TestDataDerSkalParses`,
  };

  expected = `TestDataDerSkalParses`;

  actual = p.parseQuizQuestion(inputData).idQuizQuestion;

  assert.equal(actual, expected,
    `(2.4){ Metoden skal kunne returnere en parset version af et QUIZ QUESTION data`);

  /* 2.5 */
  resetParsedData();
  inputData =  {
    ID_FLASHCARD: `TestDataDerSkalParses`,
  };
  expected = `TestDataDerSkalParses`;

  actual = p.parseFlashcard(inputData).idFlashcard;

  assert.equal(actual, expected,
    `(2.5){ Metoden skal kunne returnere en parset version af et FLASHCARD data`);

  /* 2.6 */
  resetParsedData();
  inputData = {
    ID_USER: `TestDataDerSkalParses`,
  };
  expected = `TestDataDerSkalParses`;

  actual = p.parseUser(inputData).idUser;

  assert.equal(actual, expected,
    `(2.6){ Metoden skal kunne returnere en parset version af USER data`);

  /* 2.7 */
  resetParsedData();
  inputData = {
    ID_KEYWORD: `TestDataDerSkalParses`,
  };
  expected = `TestDataDerSkalParses`;

  actual = p.parseKeyword(inputData).idKeyword;

  assert.equal(actual, expected,
    `(2.7){ Metoden skal kunne returnere en parset version af et KEYWORD data`);

  /* 2.7.1 */
  resetParsedData();
  inputData = {
    ID_KEYWORD_LINK: `TestDataDerSkalParses`,
  };
  expected = `TestDataDerSkalParses`;

  actual = p.parseKeywordLink(inputData).idKeywordLink;

  assert.equal(actual, expected,
    `(2.7.1){ Metoden skal kunne returnere en parset version af et KEYWORD_LINK data`);


  /* 2.8 */
  resetParsedData();
  inputData = {
    ID_USER_GROUP: `TestDataDerSkalParses`,
  };
  expected = `TestDataDerSkalParses`;

  actual = p.parseGroup(inputData).idGroup;

  assert.equal(actual, expected,
    `(2.8){ Metoden skal kunne returnere en parset version af et GROUP data`);


  /* 2.9.0 */
  resetParsedData();
  inputData = [`ID_DOCUMENT_SECTION`, `idDocument`, `ANSWERS`, `answers`];
  expected = [`idSection`, `ID_DOCUMENT`, `answers`, `ANSWERS`];

  actual = [
    p.convertNameBetweenCodeAndDB(inputData[0]),
    p.convertNameBetweenCodeAndDB(inputData[1]),
    p.convertNameBetweenCodeAndDB(inputData[2]),
    p.convertNameBetweenCodeAndDB(inputData[3]),
  ];

  assert.deepEqual(actual, expected,
    `(2.9.0){ Metoden skal kunne konvertere mellem  Database kollonne navne i CAPS_CAPS og tilsvande navn i classses i camalCase  `);

  /* 3 */
  console.log(`3 test af at parseren kan vurdere ELEMENT_TYPE korrekt`);
  /* 3.1 */
  resetParsedData();

  inputData = [{
    ID_DOCUMENT: `TestDataDerSkalParses`,
    ELEMENT_TYPE: `document`,
  }];
  expected = `TestDataDerSkalParses`;

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.equal(actual[0].idDocument, expected,
      `(3.1){ Metoden skal parse dokument data, når ELEMENT_TYPE = "document"`);
  }
  catch (error) {
    assert.false(true, `(3.1) Document er ikke oprettet i parseren`);
  }

  /* 3.2 */
  resetParsedData();

  inputData =  [{
    ID_DOCUMENT_SECTION: `TestDataDerSkalParses`,
    ELEMENT_TYPE: `section`,
  }];
  expected = `TestDataDerSkalParses`;

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.equal(actual[0].idSection, expected,
      `(3.2){ Metoden skal parse section data, når ELEMENT_TYPE = "section"`);
  }
  catch (error) {
    assert.false(true, `(3.2) Section er ikke oprettet i parseren`);
  }

  /* 3.3 */
  resetParsedData();

  inputData = [{
    ID_EVALUATION: `TestDataDerSkalParses`,
    ELEMENT_TYPE: `evaluation`,
  }];
  expected = `TestDataDerSkalParses`;
  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.equal(actual[0].idEvaluation, expected,
      `(3.3){ Metoden skal parse evaluation data, når ELEMENT_TYPE = "evaluation"`);
  }
  catch (error) {
    assert.false(true, `(3.3) Evaluation er ikke oprettet i parseren`);
  }

  /* 3.4 */
  resetParsedData();

  inputData = [{
    ID_QUIZ_QUESTION: `TestDataDerSkalParses`,
    ELEMENT_TYPE: `quiz_question`,
  }];
  expected = `TestDataDerSkalParses`;

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.equal(actual[0].idQuizQuestion, expected,
      `(3.4){ Metoden skal parse quiz question data, når ELEMENT_TYPE = "quiz_question"`);
  }
  catch (error) {
    assert.false(true, `(3.4) QuizQuestion er ikke oprettet i parseren`);
  }

  /* 3.5 */
  resetParsedData();

  inputData = [{
    ID_FLASHCARD: `TestDataDerSkalParses`,
    ELEMENT_TYPE: `flashcard`,
  }];
  expected = `TestDataDerSkalParses`;

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.equal(actual[0].idFlashcard, expected,
      `(3.5){ Metoden skal parse flashcard data, når ELEMENT_TYPE = "flashcard"`);
  }
  catch (error) {
    assert.false(true, `(3.5) Flashcard er ikke oprettet i parseren`);
  }


  /* 3.6 */
  resetParsedData();

  inputData = [{
    ELEMENT_TYPE: `user`,
    ID_USER: `TestDataDerSkalParses`,
  }];

  expected = `TestDataDerSkalParses`;

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.equal(actual[0].idUser, expected,
      `(3.6){ Metoden skal parse user data, når ELEMENT_TYPE = "user"`);
  }
  catch (error) {
    assert.false(true, `(3.6) User er ikke oprettet i parseren`);
  }


  /* 3.7 */
  resetParsedData();

  inputData = [{
    ID_KEYWORD: `TestDataDerSkalParses`,
    ELEMENT_TYPE: `keyword`,
  }];

  expected = `TestDataDerSkalParses`;

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.equal(actual[0].idKeyword, expected,
      `(3.7){ Metoden skal parse keyword data, når ELEMENT_TYPE = "keyword"`);
  }
  catch (error) {
    assert.false(true, `(3.7) Keyword er ikke oprettet i parseren`);
  }

  /* 3.7.1 */
  resetParsedData();

  inputData = [{
    ID_KEYWORD_LINK: `TestDataDerSkalParses`,
    ELEMENT_TYPE: `keyword_link`,
  }];

  expected = `TestDataDerSkalParses`;

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.equal(actual[0].idKeywordLink, expected,
      `(3.7.1){ Metoden skal parse keyword_link data, når ELEMENT_TYPE = "keyword_link"`);
  }
  catch (error) {
    assert.false(true, `(3.7.1) Keyword_link er ikke oprettet i parseren`);
  }


  /* 3.8 */
  resetParsedData();

  inputData = [{
    ELEMENT_TYPE: `user_group`,
    ID_USER_GROUP: `TestDataDerSkalParses`,
  }];

  expected = `TestDataDerSkalParses`;

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.deepEqual(actual[0].idGroup, expected,
      `(3.8){ Metoden skal parse user_group data, når ELEMENT_TYPE = "group"`);
  }
  catch (error) {
    assert.false(true, `(3.8) Group er ikke oprettet i parseren`);
  }

  /* 4 */
  console.log(`4 Test af at de kolonner som parseren forventer stemmer overens med MySQL databasens kolonner`);
  const req = { session: {}, params: {}, body: {} }; // req bruges til at objekter konstrueres ud fra et validRequest (se Model metoden)
  /* 4.1 */
  resetParsedData();

  const D =  new Document(req);
  expected = [
    [
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `ID_USER_GROUP` },
      { COLUMN_NAME: `ID_USER` },
      { COLUMN_NAME: `TITLE` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
    ],
  ];

  actual = [await D.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.1){  Parserens forventede kolonner skal stemme overens med MySQL Databasens document kolonnenavne`);
  D.connect.end();

  /* 4.2 */
  resetParsedData();

  const S = new Section(req);
  expected = [
    [
      { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
      { COLUMN_NAME: `ID_USER_GROUP` },
      { COLUMN_NAME: `ID_USER` },
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `SECTION_TITLE` },
      { COLUMN_NAME: `SECTION_NUMBER` },
      { COLUMN_NAME: `SECTION_CONTENT` },
      { COLUMN_NAME: `SECTION_TEASER` },
      { COLUMN_NAME: `KEYWORDS` },
      { COLUMN_NAME: `ELEMENT_TYPE` },

    ],
  ];

  actual = [await S.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.2){  Parserens forventede kolonner skal stemme overens med MySQL Databasens document_section kolonnenavne`);
  S.connect.end();

  /* 4.3 */
  resetParsedData();

  const Q = new Evaluation(req);
  expected = [
    [
      { COLUMN_NAME: `ID_EVALUATION` },
      { COLUMN_NAME: `ID_USER_GROUP` },
      { COLUMN_NAME: `ID_USER` },
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
      { COLUMN_NAME: `QUIZ_TITLE` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
    ],
  ];
  inputData = await Q.query(`HEAD`, `COLUMN_NAME`);

  actual = [inputData];

  assert.deepEqual(actual, expected,
    `(4.3){  Parserens forventede kolonner skal stemme overens med MySQL Databasens evaluation kolonnenavne`);
  Q.connect.end();

  /* 4.4 */
  resetParsedData();

  const Qq = new QuizQuestion(req);
  expected = [
    [
      { COLUMN_NAME: `ID_QUIZ_QUESTION` },
      { COLUMN_NAME: `ID_EVALUATION` },
      { COLUMN_NAME: `QUESTION` },
      { COLUMN_NAME: `ANSWERS` },
      { COLUMN_NAME: `CORRECT_ANSWERS` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
    ],

  ];
  actual = [await Qq.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.4){  Parserens forventede kolonner skal stemme overens med MySQL Databasens quizQuestion kolonnenavne`);
  Qq.connect.end();

  /* 4.5 */
  resetParsedData();

  const F = new Flashcard(req);
  expected = [
    [
      { COLUMN_NAME: `ID_FLASHCARD` },
      { COLUMN_NAME: `ID_USER_GROUP` },
      { COLUMN_NAME: `ID_USER` },
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
      { COLUMN_NAME: `CONCEPT` },
      { COLUMN_NAME: `DEFINITION` },
      { COLUMN_NAME: `ELEMENT_TYPE` },

    ],
  ];
  actual = [await F.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.5){  Parserens forventede kolonner skal stemme overens med MySQL Databasens flashcard kolonnenavne`);
  F.connect.end();

  /* 4.6 */
  resetParsedData();

  const U = new User(req);
  expected = [
    [
      { COLUMN_NAME: `ID_USER` },
      { COLUMN_NAME: `ID_USER_GROUP` },
      { COLUMN_NAME: `USER_NAME` },
      { COLUMN_NAME: `PASSWORD` },
      { COLUMN_NAME: `FIRST_NAME` },
      { COLUMN_NAME: `LAST_NAME` },
      { COLUMN_NAME: `EMAIL` },
      { COLUMN_NAME: `STUDY_SUBJECT` },
      { COLUMN_NAME: `SEMESTER` },
      { COLUMN_NAME: `UNIVERSITY` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
    ],
  ];

  actual = [await U.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.6){  Parserens forventede kolonner skal stemme overens med MySQL Databasens user kolonnenavne`);
  U.connect.end();

  /* 4.7 */
  resetParsedData();

  const K = new Keyword(req);
  expected = [
    [
      { COLUMN_NAME: `ID_KEYWORD` },
      { COLUMN_NAME: `KEYWORD` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
    ],
  ];
  actual = [await K.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.7){  Parserens forventede kolonner skal stemme overens med MySQL Databasens keyword kolonnenavne`);

  K.connect.end();

  /* 4.7.1 */
  resetParsedData();

  const Kl = new KeywordLink(req);
  expected = [
    [
      { COLUMN_NAME: `ID_KEYWORD_LINK` },
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `ID_DOCUMENT_SECTION` },

      { COLUMN_NAME: `ID_EVALUATION` },
      { COLUMN_NAME: `ID_QUIZ_QUESTION` },
      { COLUMN_NAME: `ID_KEYWORD` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
    ],
  ];
  actual = [await Kl.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.7.1){  Parserens forventede kolonner skal stemme overens med MySQL Databasens keyword_link kolonnenavne`);

  Kl.connect.end();

  /* 4.8 */
  resetParsedData();

  const G = new Group(req);
  expected = [
    [

      { COLUMN_NAME: `ID_USER_GROUP` },
      { COLUMN_NAME: `NAME` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
    ],
  ];
  actual = [await G.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.8){  Parserens forventede kolonner skal stemme overens med MySQL Databasens user_group kolonnenavne`);

  G.connect.end();

  assert.end();
});
