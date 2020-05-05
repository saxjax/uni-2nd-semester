/* eslint no-console: off */
// nodemon tests/backend/Database/test.ParseSQL.js | .\node_modules\.bin\tap-spec

const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const test = testDecorater(tape);
const { ParseSql } = require(`../../../node/Models/AbstractClasses/ParseSQL`);
const { Group } = require(`../../../node/Models/Group`);
const { User } = require(`../../../node/Models/User`);
const { Document } = require(`../../../node/Models/Document`);
const { Section } = require(`../../../node/Models/Section`);
const { Evaluation } = require(`../../../node/Models/Evaluation`);
const { QuizQuestion } = require(`../../../node/Models/QuizQuestion`);
const { QuizResult } = require(`../../../node/Models/QuizResult`);
// const { Flashcard } = require(`../../../node/Models/Flashcard`);
// const { FlashcardResult } = require(`../../../node/Models/FlashcardResult`);
const { Keyword } = require(`../../../node/Models/Keyword`);
const { KeywordLink } = require(`../../../node/Models/KeywordLink`);

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
    SECTION_CONTENT: `HelloHello`,
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
  /* FLASHCARD IKKE IMPLEMENTERET!
  resetParsedData();
  inputData =  {
    ID_FLASHCARD: `TestDataDerSkalParses`,
  };
  expected = `TestDataDerSkalParses`;

  actual = p.parseFlashcard(inputData).idFlashcard;

  assert.equal(actual, expected,
    `(2.5){ Metoden skal kunne returnere en parset version af et FLASHCARD data`);
  */
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

  /* 2.9 */
  resetParsedData();
  inputData = {
    ID_QUIZ_RESULT: `TestDataDerSkalParses`,
  };

  expected = `TestDataDerSkalParses`;

  actual = p.parseQuizResult(inputData).idQuizResult;

  assert.equal(actual, expected,
    `(2.9){ Metoden skal kunne returnere en parset version af et QUIZ RESULT data`);

  /* 2.10 */
  /* FLASHCARD IKKE IMPLEMENTERET!
  resetParsedData();
  inputData = {
    ID_FLASHCARD_RESULT: `TestDataDerSkalParses`,
  };

  expected = `TestDataDerSkalParses`;

  actual = p.parseFlashcardResult(inputData).idFlashcardResult;

  assert.equal(actual, expected,
    `(2.10){ Metoden skal kunne returnere en parset version af et FLASHCARD RESULT data`);
  */

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
  /* FLASHCARD IKKE IMPLEMENTERET!
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
  */

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

  /* 3.9 */
  resetParsedData();

  inputData = [{
    ELEMENT_TYPE: `quiz_result`,
    ID_QUIZ_RESULT: `TestDataDerSkalParses`,
  }];

  expected = `TestDataDerSkalParses`;

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.deepEqual(actual[0].idQuizResult, expected,
      `(3.9){ Metoden skal parse QuizResult data, når ELEMENT_TYPE = "quiz_result"`);
  }
  catch (error) {
    assert.false(true, `(3.9) QuizResult er ikke oprettet i parseren`);
  }

  /* 3.10 */
  /* FLASHCARD IKKE IMPLEMENTERET!
  resetParsedData();

  inputData = [{
    ELEMENT_TYPE: `flashcard_result`,
    ID_FLASHCARD_RESULT: `TestDataDerSkalParses`,
  }];

  expected = `TestDataDerSkalParses`;

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.deepEqual(actual[0].idFlashcardResult, expected,
      `(3.10){ Metoden skal parse FlashcardResult data, når ELEMENT_TYPE = "flaschard_result"`);
  }
  catch (error) {
    assert.false(true, `(3.10) FlaschardResult er ikke oprettet i parseren`);
  }
  */

  /* 4 */
  console.log(`4 Test af at de attributter som parseren forventer stemmer overens med MySQL databasens attributter`);
  const req = { session: {}, params: {}, body: {} }; // req bruges til at objekter konstrueres ud fra et validRequest (se Model metoden)
  let actualObject = ``; // actualObject bruges til at indeholde kolonne navnene fra MySQL database siden.
  let count = 0; // count bruges til at holde styr på, om der er oprettet lige så mange test som der er kolonnenavne, for at sikre alt bliver testet.
  /* 4.1 */
  resetParsedData();

  const G = new Group(req);
  actualObject = await G.query(`HEAD`, `COLUMN_NAME`);

  expected = Object.keys(p.parseGroup({})).length;
  actual = Object.keys(actualObject).length;
  assert.equal(actual, expected,
    `(4.1.1){Forventet: ${expected} Reel: ${actual}} Parserens forventede Group attributter skal have lige så mange attributter som MySQL Databasens user_group kolonnenavn`);

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.typeCol);
  assert.true(actual,
    `(4.1.2) Parserens forventede elementType kolonne skal stemme overens med MySQL Databasens user_group kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.groupCol);
  assert.true(actual,
    `(4.1.3) Parserens forventede idGroup kolonne skal stemme overens med MySQL Databasens user_group kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.GNameCol);
  assert.true(actual,
    `(4.1.4) Parserens forventede name kolonne skal stemme overens med MySQL Databasens user_group kolonnenavn`);
  count++;

  expected = Object.keys(p.parseGroup({})).length;
  actual = count;
  assert.equal(actual, expected,
    `(4.1.5){Forventet: ${expected} Reel: ${actual}} Mængden af tests af Group attributter skal være lige med mængden af kolonnenavne på MySQL databasen`);
  count = 0;

  G.connect.end();

  /* 4.2 */
  resetParsedData();

  const U = new User(req);
  actualObject = await U.query(`HEAD`, `COLUMN_NAME`);

  expected = Object.keys(p.parseUser({})).length;
  actual = Object.keys(actualObject).length;
  assert.equal(actual, expected,
    `(4.2.1){Forventet: ${expected} Reel: ${actual}} Parserens forventede User attributter skal have lige så mange attributter som MySQL Databasens user kolonnenavn`);

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.typeCol);
  assert.true(actual,
    `(4.2.2) Parserens forventede elementType kolonne skal stemme overens med MySQL Databasens user kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.groupCol);
  assert.true(actual,
    `(4.2.3) Parserens forventede idGroup kolonne skal stemme overens med MySQL Databasens user kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.userCol);
  assert.true(actual,
    `(4.2.4) Parserens forventede idUser kolonne skal stemme overens med MySQL Databasens user kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.UUsernameCol);
  assert.true(actual,
    `(4.2.5) Parserens forventede username kolonne skal stemme overens med MySQL Databasens user kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.UPasswordCol);
  assert.true(actual,
    `(4.2.6) Parserens forventede password kolonne skal stemme overens med MySQL Databasens user kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.UFirstNameCol);
  assert.true(actual,
    `(4.2.7) Parserens forventede firstName kolonne skal stemme overens med MySQL Databasens user kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.ULastNameCol);
  assert.true(actual,
    `(4.2.8) Parserens forventede lastLame kolonne skal stemme overens med MySQL Databasens user kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.UEmailCol);
  assert.true(actual,
    `(4.2.9) Parserens forventede email kolonne skal stemme overens med MySQL Databasens user kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.UStudySubjectCol);
  assert.true(actual,
    `(4.2.10) Parserens forventede studySubject kolonne skal stemme overens med MySQL Databasens user kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.USemesterCol);
  assert.true(actual,
    `(4.2.11) Parserens forventede semester kolonne skal stemme overens med MySQL Databasens user kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.UUniversityCol);
  assert.true(actual,
    `(4.2.12) Parserens forventede university kolonne skal stemme overens med MySQL Databasens user kolonnenavn`);
  count++;

  expected = Object.keys(p.parseUser({})).length;
  actual = count;
  assert.equal(actual, expected,
    `(4.2.13){Forventet: ${expected} Reel: ${actual}} Mængden af tests af User attributter skal være lige med mængden af kolonnenavne på MySQL databasen`);
  count = 0;

  U.connect.end();

  /* 4.3 */
  resetParsedData();

  const D =  new Document(req);
  actualObject = await D.query(`HEAD`, `COLUMN_NAME`);

  expected = Object.keys(p.parseDocument({})).length;
  actual = Object.keys(actualObject).length;
  assert.equal(actual, expected,
    `(4.3.1){Forventet: ${expected} Reel: ${actual}} Parserens forventede Document attributter skal have lige så mange attributter som MySQL Databasens document kolonnenavn`);

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.typeCol);
  assert.true(actual,
    `(4.3.2) Parserens forventede elementType kolonne skal stemme overens med MySQL Databasens document kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.groupCol);
  assert.true(actual,
    `(4.3.3) Parserens forventede idGroup kolonne skal stemme overens med MySQL Databasens document kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.userCol);
  assert.true(actual,
    `(4.3.4) Parserens forventede idUser kolonne skal stemme overens med MySQL Databasens document kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.documentCol);
  assert.true(actual,
    `(4.3.5) Parserens forventede idDocument kolonne skal stemme overens med MySQL Databasens document kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.DTitleCol);
  assert.true(actual,
    `(4.3.6) Parserens forventede title kolonne skal stemme overens med MySQL Databasens document kolonnenavn`);
  count++;

  expected = Object.keys(p.parseDocument({})).length;
  actual = count;
  assert.equal(actual, expected,
    `(4.3.7){Forventet: ${expected} Reel: ${actual}} Mængden af tests af Document attributter skal være lige med mængden af kolonnenavne på MySQL databasen`);
  count = 0;

  D.connect.end();

  /* 4.4 */
  resetParsedData();

  const S = new Section(req);
  actualObject = await S.query(`HEAD`, `COLUMN_NAME`);

  expected = Object.keys(p.parseSection({})).length;
  actual = Object.keys(actualObject).length;
  assert.equal(actual, expected,
    `(4.4.1){Forventet: ${expected} Reel: ${actual}} Parserens forventede Section attributter skal have lige så mange attributter som MySQL Databasens section kolonnenavn`);

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.typeCol);
  assert.true(actual,
    `(4.4.2) Parserens forventede elementType kolonne skal stemme overens med MySQL Databasens section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.groupCol);
  assert.true(actual,
    `(4.4.3) Parserens forventede idGroup kolonne skal stemme overens med MySQL Databasens section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.userCol);
  assert.true(actual,
    `(4.4.4) Parserens forventede idUser kolonne skal stemme overens med MySQL Databasens section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.documentCol);
  assert.true(actual,
    `(4.4.5) Parserens forventede idDocument kolonne skal stemme overens med MySQL Databasens section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.sectionCol);
  assert.true(actual,
    `(4.4.6) Parserens forventede idSection kolonne skal stemme overens med MySQL Databasens section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.SNumberCol);
  assert.true(actual,
    `(4.4.7) Parserens forventede number kolonne skal stemme overens med MySQL Databasens section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.STitleCol);
  assert.true(actual,
    `(4.4.8) Parserens forventede title kolonne skal stemme overens med MySQL Databasens section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.SContentCol);
  assert.true(actual,
    `(4.4.9) Parserens forventede content kolonne skal stemme overens med MySQL Databasens section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.STeaserCol);
  assert.true(actual,
    `(4.4.10) Parserens forventede teaser kolonne skal stemme overens med MySQL Databasens section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.SKeywordsCol);
  assert.true(actual,
    `(4.2.11) Parserens forventede keywords kolonne skal stemme overens med MySQL Databasens section kolonnenavn`);
  count++;

  expected = Object.keys(p.parseSection({})).length;
  actual = count;
  assert.equal(actual, expected,
    `(4.2.12){Forventet: ${expected} Reel: ${actual}} Mængden af tests af Section attributter skal være lige med mængden af kolonnenavne på MySQL databasen`);
  count = 0;

  S.connect.end();

  /* 4.5 */
  resetParsedData();

  const E = new Evaluation(req);
  actualObject = await E.query(`HEAD`, `COLUMN_NAME`);

  expected = Object.keys(p.parseEvaluation({})).length;
  actual = Object.keys(actualObject).length;
  assert.equal(actual, expected,
    `(4.5.1){Forventet: ${expected} Reel: ${actual}} Parserens forventede Evaluation attributter skal have lige så mange attributter som MySQL Databasens section kolonnenavn`);

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.typeCol);
  assert.true(actual,
    `(4.5.2) Parserens forventede elementType kolonne skal stemme overens med MySQL Databasens document_section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.groupCol);
  assert.true(actual,
    `(4.5.3) Parserens forventede idGroup kolonne skal stemme overens med MySQL Databasens document_section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.userCol);
  assert.true(actual,
    `(4.5.4) Parserens forventede idUser kolonne skal stemme overens med MySQL Databasens document_section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.documentCol);
  assert.true(actual,
    `(4.5.5) Parserens forventede idDocument kolonne skal stemme overens med MySQL Databasens document_section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.sectionCol);
  assert.true(actual,
    `(4.5.6) Parserens forventede idSection kolonne skal stemme overens med MySQL Databasens document_section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.evaluationCol);
  assert.true(actual,
    `(4.5.7) Parserens forventede idEvaluation kolonne skal stemme overens med MySQL Databasens document_section kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.ETitleCol);
  assert.true(actual,
    `(4.5.8) Parserens forventede title kolonne skal stemme overens med MySQL Databasens document_section kolonnenavn`);
  count++;

  expected = Object.keys(p.parseEvaluation({})).length;
  actual = count;
  assert.equal(actual, expected,
    `(4.5.9){Forventet: ${expected} Reel: ${actual}} Mængden af tests af Evaluation attributter skal være lige med mængden af kolonnenavne på MySQL databasen`);
  count = 0;

  E.connect.end();

  /* 4.6 */
  resetParsedData();

  const QQ = new QuizQuestion(req);
  actualObject = await QQ.query(`HEAD`, `COLUMN_NAME`);

  expected = Object.keys(p.parseQuizQuestion({})).length;
  actual = Object.keys(actualObject).length;
  assert.equal(actual, expected,
    `(4.6.1){Forventet: ${expected} Reel: ${actual}} Parserens forventede QuizQuestion attributter skal have lige så mange attributter som MySQL Databasens section kolonnenavn`);

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.typeCol);
  assert.true(actual,
    `(4.6.2) Parserens forventede elementType kolonne skal stemme overens med MySQL Databasens tilsvarende quiz_question kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.evaluationCol);
  assert.true(actual,
    `(4.6.3) Parserens forventede idEvaluation kolonne skal stemme overens med MySQL Databasens tilsvarende quiz_question kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.quizQuestionCol);
  assert.true(actual,
    `(4.6.4) Parserens forventede idQuizQuestion kolonne skal stemme overens med MySQL Databasens tilsvarende quiz_question kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.QQQuestionCol);
  assert.true(actual,
    `(4.6.5) Parserens forventede question kolonne skal stemme overens med MySQL Databasens tilsvarende quiz_question kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.QQAnswersCol);
  assert.true(actual,
    `(4.6.6) Parserens forventede answers kolonne skal stemme overens med MySQL Databasens tilsvarende quiz_question kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.QQCorrectnessCol);
  assert.true(actual,
    `(4.6.7) Parserens forventede correctness kolonne skal stemme overens med MySQL Databasens tilsvarende quiz_question kolonnenavn`);
  count++;

  expected = Object.keys(p.parseQuizQuestion({})).length;
  actual = count;
  assert.equal(actual, expected,
    `(4.6.8){Forventet: ${expected} Reel: ${actual}} Mængden af tests af Quiz Question attributter skal være lige med mængden af kolonnenavne på MySQL databasen`);
  count = 0;

  QQ.connect.end();

  /* 4.7 */
  resetParsedData();

  const QR = new QuizResult(req);
  actualObject = await QR.query(`HEAD`, `COLUMN_NAME`);

  expected = Object.keys(p.parseQuizResult({})).length;
  actual = Object.keys(actualObject).length;
  assert.equal(actual, expected,
    `(4.7.1){Forventet: ${expected} Reel: ${actual}} Parserens forventede QuizResult attributter skal have lige så mange attributter som MySQL Databasens quiz_question_result kolonnenavn`);

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.typeCol);
  assert.true(actual,
    `(4.7.2) Parserens forventede elementType kolonne skal stemme overens med MySQL Databasens tilsvarende quiz_question_result kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.quizResultCol);
  assert.true(actual,
    `(4.7.3) Parserens forventede idQuizResult kolonne skal stemme overens med MySQL Databasens tilsvarende quiz_question_result kolonnenavn`);
  count++;

  expected = Object.keys(p.parseQuizQuestion({})).length;
  actual = count;
  assert.equal(actual, expected,
    `(4.7.4){Forventet: ${expected} Reel: ${actual}} Mængden af tests af QuizResult attributter skal være lige med mængden af kolonnenavne på MySQL databasen`);
  count = 0;

  QR.connect.end();

  /* 4.8 */
  /* FLASHCARD IKKE IMPLEMENTERET!
  resetParsedData();

  const F = new Flashcard(req);
  actualObject = await F.query(`HEAD`, `COLUMN_NAME`);

  expected = Object.keys(p.parseFlashcard({})).length;
  actual = Object.keys(actualObject).length;
  assert.equal(actual, expected,
    `(4.8.1){Forventet: ${expected} Reel: ${actual}} Parserens forventede Flashcard attributter skal have lige så mange attributter som MySQL Databasens flashcard kolonnenavn`);

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.typeCol);
  assert.true(actual,
    `(4.8.2) Parserens forventede elementType kolonne skal stemme overens med MySQL Databasens tilsvarende flaschard kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.evaluationCol);
  assert.true(actual,
    `(4.8.3) Parserens forventede idEvaluation kolonne skal stemme overens med MySQL Databasens tilsvarende flaschard kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.flashcardCole);
  assert.true(actual,
    `(4.8.4) Parserens forventede idFlashcard kolonne skal stemme overens med MySQL Databasens tilsvarende flaschard kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.FConceptCol);
  assert.true(actual,
    `(4.8.5) Parserens forventede concept kolonne skal stemme overens med MySQL Databasens tilsvarende flaschard kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.FDefinitionCol);
  assert.true(actual,
    `(4.8.6) Parserens forventede definition kolonne skal stemme overens med MySQL Databasens tilsvarende flaschard kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.FCorrectnessCol);
  assert.true(actual,
    `(4.8.7) Parserens forventede correctness kolonne skal stemme overens med MySQL Databasens tilsvarende flaschard kolonnenavn`);
  count++;

  expected = Object.keys(p.parseQuizQuestion({})).length;
  actual = count;
  assert.equal(actual, expected,
    `(4.8.8){Forventet: ${expected} Reel: ${actual}} Mængden af tests af Flashcard attributter skal være lige med mængden af kolonnenavne på MySQL databasen`);
  count = 0;

  F.connect.end();
  */

  /* 4.9 */
  /* FLASHCARD IKKE IMPLEMENTERET!
  resetParsedData();

  const FR = new FlashcardResult(req);
  actualObject = await FR.query(`HEAD`, `COLUMN_NAME`);

  expected = Object.keys(p.parseFlashcardResult({})).length;
  actual = Object.keys(actualObject).length;
  assert.equal(actual, expected,
    `(4.9.1){Forventet: ${expected} Reel: ${actual}} Parserens forventede FlashcardResult attributter skal have lige så mange attributter som MySQL Databasens flashcard_result kolonnenavn`);

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.typeCol);
  assert.true(actual,
    `(4.9.2) Parserens forventede elementType kolonne skal stemme overens med MySQL Databasens tilsvarende flashcard_result kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.flashcardResultCol);
  assert.true(actual,
    `(4.9.3) Parserens forventede idFlashcardResult kolonne skal stemme overens med MySQL Databasens tilsvarende flashcard_result kolonnenavn`);
  count++;

  expected = Object.keys(p.parseQuizQuestion({})).length;
  actual = count;
  assert.equal(actual, expected,
    `(4.9.4){Forventet: ${expected} Reel: ${actual}} Mængden af tests af FlashcardResult attributter skal være lige med mængden af kolonnenavne på MySQL databasen`);
  count = 0;

  FR.connect.end();
  */

  /* 4.10 */
  resetParsedData();

  const K = new Keyword(req);
  actualObject = await K.query(`HEAD`, `COLUMN_NAME`);

  expected = Object.keys(p.parseKeyword({})).length;
  actual = Object.keys(actualObject).length;
  assert.equal(actual, expected,
    `(4.10.1){Forventet: ${expected} Reel: ${actual}} Parserens forventede Keyword attributter skal have lige så mange attributter som MySQL Databasens keyword kolonnenavn`);

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.typeCol);
  assert.true(actual,
    `(4.10.2) Parserens forventede elementType kolonne skal stemme overens med MySQL Databasens tilsvarende keyword kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.keywordCol);
  assert.true(actual,
    `(4.10.3) Parserens forventede idKeyword kolonne skal stemme overens med MySQL Databasens tilsvarende keyword kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.KKeywordCol);
  assert.true(actual,
    `(4.10.4) Parserens forventede keyword kolonne skal stemme overens med MySQL Databasens tilsvarende keyword kolonnenavn`);
  count++;

  expected = Object.keys(p.parseKeyword({})).length;
  actual = count;
  assert.equal(actual, expected,
    `(4.10.5){Forventet: ${expected} Reel: ${actual}} Mængden af tests af Keyword attributter skal være lige med mængden af kolonnenavne på MySQL databasen`);
  count = 0;

  K.connect.end();

  /* 4.11 */
  resetParsedData();

  const KL = new KeywordLink(req);
  actualObject = await KL.query(`HEAD`, `COLUMN_NAME`);

  expected = Object.keys(p.parseKeywordLink({})).length;
  actual = Object.keys(actualObject).length;
  assert.equal(actual, expected,
    `(4.11.1){Forventet: ${expected} Reel: ${actual}} Parserens forventede KeywordLink attributter skal have lige så mange attributter som MySQL Databasens keyword_link kolonnenavn`);

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.typeCol);
  assert.true(actual,
    `(4.11.2) Parserens forventede elementType kolonne skal stemme overens med MySQL Databasens keyword_link kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.documentCol);
  assert.true(actual,
    `(4.11.5) Parserens forventede idDocument kolonne skal stemme overens med MySQL Databasens keyword_link kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.sectionCol);
  assert.true(actual,
    `(4.11.6) Parserens forventede idSection kolonne skal stemme overens med MySQL Databasens keyword_link kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.evaluationCol);
  assert.true(actual,
    `(4.11.7) Parserens forventede idEvaluation kolonne skal stemme overens med MySQL Databasens keyword_link kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.quizQuestionCol);
  assert.true(actual,
    `(4.11.8) Parserens forventede idQuizQuestion kolonne skal stemme overens med MySQL Databasens keyword_link kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.flashcardCol);
  assert.true(actual,
    `(4.11.9) Parserens forventede idFlashcard idFlashcard skal stemme overens med MySQL Databasens keyword_link kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.keywordCol);
  assert.true(actual,
    `(4.11.10) Parserens forventede idKeyword kolonne skal stemme overens med MySQL Databasens keyword_link kolonnenavn`);
  count++;

  actual = actualObject.find((obj) => obj.COLUMN_NAME === p.keywordLinkCol);
  assert.true(actual,
    `(4.11.11) Parserens forventede idKeywordLink kolonne skal stemme overens med MySQL Databasens keyword_link kolonnenavn`);
  count++;

  expected = Object.keys(p.parseSection({})).length;
  actual = count;
  assert.equal(actual, expected,
    `(4.11.12){Forventet: ${expected} Reel: ${actual}} Mængden af tests af KeywordLink attributter skal være lige med mængden af kolonnenavne på MySQL databasen`);
  count = 0;

  KL.connect.end();

  assert.end();
});
