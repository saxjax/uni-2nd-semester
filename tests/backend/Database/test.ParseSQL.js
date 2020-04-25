/* eslint no-console: off */
// nodemon tests/backend/Database/test.ParseSQL.js | .\node_modules\.bin\tap-spec

const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const test = testDecorater(tape);
const { ParseSql } = require(`../../../node/Models/AbstractClasses/ParseSQL`);
const { Document } = require(`../../../node/Models/Document`);
const { Section } = require(`../../../node/Models/Section`);
const { Quiz } = require(`../../../node/Models/Quiz`);
const { QuizQuestion } = require(`../../../node/Models/QuizQuestion`);
const { Flashcard } = require(`../../../node/Models/Flashcard`);
const { Keyword } = require(`../../../node/Models/Keyword`);
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
  console.log(`2 test af de enkelte parse funktioner`);
  /* 2.1 */
  resetParsedData();

  inputData = {
    ID_DOCUMENT: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    DOCUMENT_TITLE: `fiktiv viden`,
    ELEMENT_TYPE: `document`,
  };
  expected = {
    elementType: `document`,
    idDocument: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    title: `fiktiv viden`,
  };

  actual = p.parseDocument(inputData);

  assert.deepEqual(actual, expected,
    `(2.1){ Metoden skal kunne returnere en parset version af  DOCUMENT-data`);

  /* 2.2 */
  resetParsedData();
  inputData = {
    ID_DOCUMENT_SECTION: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    ID_DOCUMENT: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    SECTION_NUMBER: 9.9,
    SECTION_TITLE: `fiktiv viden`,
    SECTION_TEASER: `En lille tisser`,
    SECTION_CONTENT: `lidt tekst 3`,
    ELEMENT_TYPE: `section`,
  };
  expected = {
    elementType: `section`,
    idDocument: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    idSection: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    idUser: `undefined`,
    idGroup: `undefined`,
    number: `9.9`,
    title: `fiktiv viden`,
    content: `lidt tekst 3`,
    teaser: `En lille tisser`,
    keywords: `undefined`,
  };

  actual = p.parseSection(inputData);

  assert.deepEqual(actual, expected,
    `(2.2){ Metoden skal kunne returnere en parset version af  SECTION-data`);

  /* 2.3 */
  resetParsedData();
  inputData = {
    ID_QUIZ: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    ID_DOCUMENT: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    ID_DOCUMENT_SECTION: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    SECTION_TITLE: `fiktiv viden`,
    ELEMENT_TYPE: `quiz`,
  };
  expected = {
    elementType: `quiz`,
    idQuiz: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    idDocument: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    idDocumentSection: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    title: `fiktiv viden`,
    keywords: `undefined`,
  };
  actual = p.parseQuiz(inputData);

  assert.deepEqual(actual, expected,
    `(2.3){ Metoden skal kunne returnere en parset version af QUIZ data`);

  /* 2.4 */
  resetParsedData();
  inputData = {
    ID_QUIZ_QUESTION: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_QUIZ: `11111111-aaaa-bbbb-1111-111111111111`,
    QUESTION: `hvad er?`,
    ANSWER_1: `ans1`,
    ANSWER_2: `ans2`,
    ANSWER_3: `ans3`,
    ANSWER_4: `ans4`,
    CORRECT_ANSWER: `0000`,
    ELEMENT_TYPE: `quiz_question`,
  };

  expected = {
    idQuestion: `11111111-aaaa-bbbb-1111-111111111111`,
    idQuiz: `11111111-aaaa-bbbb-1111-111111111111`,
    question: `hvad er?`,
    answer1: `ans1`,
    answer2: `ans2`,
    answer3: `ans3`,
    answer4: `ans4`,
    correctness: `0000`,
  };
  actual = p.parseQuizQuestion(inputData);

  assert.deepEqual(actual, expected,
    `(2.4){ Metoden skal kunne returnere en parset version af et QUIZ QUESTION data`);

  /* 2.5 */
  resetParsedData();
  inputData =  {
    ID_FLASHCARD: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_USER: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT_SECTION: `11111111-aaaa-bbbb-1111-111111111111`,
    CONCEPT: `hvad er?`,
    DEFINITION: `ans1`,
    CORRECT_ANSWER: `1`,
    ELEMENT_TYPE: `flashcard`,
  };
  expected = {
    elementType: `flashcard`,
    idFlashcard: `11111111-aaaa-bbbb-1111-111111111111`,
    idUser: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
    concept: `hvad er?`,
    definition: `ans1`,
    correctness: `1`,

  };
  actual = p.parseFlashcard(inputData);

  assert.deepEqual(actual, expected,
    `(2.5){ Metoden skal kunne returnere en parset version af et FLASHCARD data`);

  /* 2.6 */
  resetParsedData();
  inputData = {
    ELEMENT_TYPE: `user`,
    ID_USER: `11111111-aaaa-bbbb-1111-111111111111`,
    USER_NAME: `Test user`,
    PASSWORD: `****`,
    FIRST_NAME: `test fornavn`,
    LAST_NAME: `test efternavn`,
    EMAIL: `test@email.com`,
    STUDY_SUBJECT: `software`,
    SEMESTER: `2`,
    UNIVERSITY: `MIT`,
  };
  expected = {
    elementType: `user`,
    idUser: `11111111-aaaa-bbbb-1111-111111111111`,
    userName: `Test user`,
    // password: `****`,
    firstName: `test fornavn`,
    lastName: `test efternavn`,
    email: `test@email.com`,
    studySubject: `software`,
    semester: `2`,
    university: `MIT`,
  };

  actual = p.parseUser(inputData);

  assert.deepEqual(actual, expected,
    `(2.6){ Metoden skal kunne returnere en parset version af USER data`);

  /* 2.7 */
  resetParsedData();
  inputData = {
    ID_KEYWORD: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT_SECTION: `11111111-aaaa-bbbb-1111-111111111111`,
    KEYWORD: `keyword Test`,
    ELEMENT_TYPE: `keyword`,
  };
  expected = {
    idKeyword: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
    keyword: `keyword Test`,
    elementType: `keyword`,
  };
  actual = p.parseKeyword(inputData);

  assert.deepEqual(actual, expected,
    `(2.7){ Metoden skal kunne returnere en parset version af et KEYWORD data`);

  /* 2.8 */
  resetParsedData();
  inputData = {
    ELEMENT_TYPE: `group`,
    ID_USER_GROUP: `11111111-aaaa-bbbb-1111-111111111111`,
    NAME: `TestName`,
  };
  expected = {
    elementType: `group`,
    idGroup: `11111111-aaaa-bbbb-1111-111111111111`,
    name: `TestName`,
  };
  actual = p.parseKeyword(inputData);

  assert.deepEqual(actual, expected,
    `(2.8){ Metoden skal kunne returnere en parset version af et GROUP data`);

  /* 3 */
  console.log(`3 test af at parseren kan vurdere ELEMENT_TYPE korrekt`);
  /* 3.1 */
  resetParsedData();

  inputData = [{
    ID_DOCUMENT: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_USER: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_USER_GROUP: `11111111-aaaa-bbbb-1111-111111111111`,
    TITLE: `Test Title`,
    ELEMENT_TYPE: `document`,
  }];
  expected = [{
    idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
    idUser: `11111111-aaaa-bbbb-1111-111111111111`,
    idUserGroup: `11111111-aaaa-bbbb-1111-111111111111`,
    title: `Test Title`,
    elementType: `document`,
  }];
  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.deepEqual(actual, expected,
      `(3.1){ Metoden skal parse dokument data, når ELEMENT_TYPE = "document"`);
  }
  catch (error) {
    assert.false(true, `(3.1) Document er ikke oprettet i parseren`);
  }

  /* 3.2 */
  resetParsedData();

  inputData =  [{
    ID_DOCUMENT_SECTION: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    ID_DOCUMENT: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    SECTION_NUMBER: 9.9,
    SECTION_TITLE: `fiktiv viden`,
    SECTION_TEASER: null,
    SECTION_CONTENT: `lidt tekst 3`,
    ELEMENT_TYPE: `section`,
  }];
  expected = [{
    elementType: `section`,
    idDocument: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    idSection: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    idUser: `undefined`,
    idGroup: `undefined`,
    number: `9.9`,
    title: `fiktiv viden`,
    content: `lidt tekst 3`,
    teaser: `lidt tekst 3`,
    keywords: `undefined`,
  }];
  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.deepEqual(actual, expected,
      `(3.2){ Metoden skal parse section data, når ELEMENT_TYPE = "section"`);
  }
  catch (error) {
    assert.false(true, `(3.2) Section er ikke oprettet i parseren`);
  }

  /* 3.3 */
  resetParsedData();

  inputData = [{
    ID_QUIZ: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT_SECTION: `11111111-aaaa-bbbb-1111-111111111111`,
    SECTION_TITLE: `fiktiv quiz viden`,
    ELEMENT_TYPE: `quiz`,
  }];
  expected = [{
    elementType: `quiz`,
    idQuiz: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
    title: `fiktiv quiz viden`,
    keywords: undefined,
  }];
  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.deepEqual(actual, expected,
      `(3.3){ Metoden skal parse quiz data, når ELEMENT_TYPE = "quiz"`);
  }
  catch (error) {
    assert.false(true, `(3.3) Quiz er ikke oprettet i parseren`);
  }

  /* 3.4 */
  resetParsedData();

  inputData = [{
    ID_QUIZ_QUESTION: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_QUIZ: `11111111-aaaa-bbbb-1111-111111111111`,
    QUESTION: `hvad er?`,
    ANSWER_1: `ans1`,
    ANSWER_2: `ans2`,
    ANSWER_3: `ans3`,
    ANSWER_4: `ans4`,
    CORRECT_ANSWER: `0000`,
    ELEMENT_TYPE: `quiz_question`,
  }];
  expected = [{
    idQuestion: `11111111-aaaa-bbbb-1111-111111111111`,
    idQuiz: `11111111-aaaa-bbbb-1111-111111111111`,
    question: `hvad er?`,
    answer1: `ans1`,
    answer2: `ans2`,
    answer3: `ans3`,
    answer4: `ans4`,
    correctness: `0000`,
  }];
  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.deepEqual(actual, expected,
      `(3.4){ Metoden skal parse quiz question data, når ELEMENT_TYPE = "quiz_question"`);
  }
  catch (error) {
    assert.false(true, `(3.4) QuizQuestion er ikke oprettet i parseren`);
  }

  /* 3.5 */
  resetParsedData();

  inputData = [{
    ID_FLASHCARD: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_USER: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT_SECTION: `11111111-aaaa-bbbb-1111-111111111111`,
    CONCEPT: `hvad er?`,
    DEFINITION: `ans1`,
    CORRECT_ANSWER: `1`,
    ELEMENT_TYPE: `flashcard`,
  }];
  expected = [{
    elementType: `flashcard`,
    idFlashcard: `11111111-aaaa-bbbb-1111-111111111111`,
    idUser: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
    concept: `hvad er?`,
    definition: `ans1`,
    correctness: `1`,

  }];
  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.deepEqual(actual, expected,
      `(3.5){ Metoden skal parse flashcard data, når ELEMENT_TYPE = "flashcard"`);
  }
  catch (error) {
    assert.false(true, `(3.5) Flashcard er ikke oprettet i parseren`);
  }

  /* 3.6 */
  resetParsedData();

  inputData = [{
    ID_KEYWORD: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT_SECTION: `11111111-aaaa-bbbb-1111-111111111111`,
    KEYWORD: `keyword Test`,
    ELEMENT_TYPE: `keyword`,
  }];

  expected = [{
    idKeyword: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
    keyword: `keyword Test`,
    elementType: `keyword`,
  }];

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.deepEqual(actual, expected,
      `(3.6){ Metoden skal parse keyword data, når ELEMENT_TYPE = "keyword"`);
  }
  catch (error) {
    assert.false(true, `(3.6) Keyword er ikke oprettet i parseren`);
  }

  /* 3.7 */
  resetParsedData();

  inputData = [{
    ELEMENT_TYPE: `user`,
    ID_USER: `11111111-aaaa-bbbb-1111-111111111111`,
    USER_NAME: `Test user`,
    PASSWORD: `****`,
    FIRST_NAME: `test fornavn`,
    LAST_NAME: `test efternavn`,
    EMAIL: `test@email.com`,
    STUDY_SUBJECT: `software`,
    SEMESTER: `2`,
    UNIVERSITY: `MIT`,
  }];

  expected = [{
    elementType: `user`,
    idUser: `11111111-aaaa-bbbb-1111-111111111111`,
    username: `Test user`,
    firstName: `test fornavn`,
    lastName: `test efternavn`,
    email: `test@email.com`,
    studySubject: `software`,
    semester: `2`,
    university: `MIT`,
  }];

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.deepEqual(actual, expected,
      `(3.7){ Metoden skal parse user data, når ELEMENT_TYPE = "user"`);
  }
  catch (error) {
    assert.false(true, `(3.7) User er ikke oprettet i parseren`);
  }

  /* 3.8 */
  resetParsedData();

  inputData = [{
    ELEMENT_TYPE: `group`,
    ID_USER_GROUP: `11111111-aaaa-bbbb-1111-111111111111`,
    NAME: `TestName`,
  }];

  expected = [{
    elementType: `group`,
    idGroup: `11111111-aaaa-bbbb-1111-111111111111`,
    name: `TestName`,
  }];

  try {
    actual = p.parseArrayOfObjects(inputData);
    assert.deepEqual(actual, expected,
      `(3.8){ Metoden skal parse user_group data, når ELEMENT_TYPE = "group"`);
  }
  catch (error) {
    assert.false(true, `(3.8) Group er ikke oprettet i parseren`);
  }

  /* 4 */
  console.log(`4 Test af at kolonne navnene fra databasen er de samme som parseren forventer`);
  const req = { session: {}, params: {}, body: {} }; // req bruges til at objekter konstrueres ud fra et validRequest (se Model metoden)
  /* 4.1 */
  resetParsedData();

  const D =  new Document(req);
  expected = [
    [
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `ID_USER` },
      { COLUMN_NAME: `ID_USER_GROUP` },
      { COLUMN_NAME: `TITLE` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
    ],
  ];

  actual = [await D.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.1){  Parserens forventede Document kolonnennavne skal stemme overens med MySQL Databasens document kolonnenavne`);
  D.connect.end();

  /* 4.2 */
  resetParsedData();

  const S = new Section(req);
  expected = [
    [
      { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `ID_USER_GROUP` },
      { COLUMN_NAME: `SECTION_TITLE` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
      { COLUMN_NAME: `SECTION_NUMBER` },
      { COLUMN_NAME: `SECTION_CONTENT` },
      { COLUMN_NAME: `SECTION_TEASER` },
      { COLUMN_NAME: `KEYWORDS` },
      { COLUMN_NAME: `ID_USER` },
    ],
  ];

  actual = [await S.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.2){  Parserens forventede Section kolonnennavne skal stemme overens med MySQL Databasens document_section kolonnenavne`);
  S.connect.end();

  /* 4.3 */
  resetParsedData();

  const Q = new Quiz(req);
  expected = [
    [
      { COLUMN_NAME: `ID_QUIZ` },
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
      { COLUMN_NAME: `SECTION_TITLE` },
      { COLUMN_NAME: `ID_USER_GROUP` },
    ],
  ];
  inputData = await Q.query(`HEAD`, `COLUMN_NAME`);

  actual = [inputData];

  assert.deepEqual(actual, expected,
    `(4.3){  Parserens forventede Quiz kolonnennavne skal stemme overens med MySQL Databasens quiz kolonnenavne`);
  Q.connect.end();

  /* 4.4 */
  resetParsedData();

  const Qq = new QuizQuestion(req);
  expected = [
    [
      { COLUMN_NAME: `ID_QUIZ` },
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
      { COLUMN_NAME: `SECTION_TITLE` },
      { COLUMN_NAME: `ID_USER_GROUP` },
    ],

  ];
  actual = [await Qq.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.4){  Parserens forventede Quiz kolonnennavne skal stemme overens med MySQL Databasens quiz kolonnenavne`);
  Qq.connect.end();

  /* 4.5 */
  resetParsedData();

  const F = new Flashcard(req);
  expected = [
    [
      { COLUMN_NAME: `ID_FLASHCARD` },
      { COLUMN_NAME: `ID_USER` },
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
      { COLUMN_NAME: `CONCEPT` },
      { COLUMN_NAME: `DEFINITION` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
      { COLUMN_NAME: `ID_USER_GROUP` },
    ],
  ];
  actual = [await F.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.5){  Parserens forventede QuizQuestion kolonnennavne skal stemme overens med MySQL Databasens quiz_question kolonnenavne`);
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
    `(4.6){  Parserens forventede User kolonnennavne skal stemme overens med MySQL Databasens user kolonnenavne`);
  U.connect.end();

  /* 4.7 */
  resetParsedData();

  const K = new Keyword(req);
  expected = [
    [
      { COLUMN_NAME: `ELEMENT_TYPE` },
      { COLUMN_NAME: `KEYWORD` },
    ],
  ];
  actual = [await K.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.7){  Parserens forventede Keyword kolonnennavne skal stemme overens med MySQL Databasens keyword kolonnenavne`);

  K.connect.end();

  /* 4.8 */
  resetParsedData();

  const G = new Group(req);
  expected = [
    [
      { COLUMN_NAME: `ELEMENT_TYPE` },
      { COLUMN_NAME: `ID_USER_GROUP` },
      { COLUMN_NAME: `NAME` },
    ],
  ];
  actual = [await K.query(`HEAD`, `COLUMN_NAME`)];

  assert.deepEqual(actual, expected,
    `(4.8){  Parserens forventede Group kolonnennavne skal stemme overens med MySQL Databasens user_group kolonnenavne`);

  G.connect.end();

  assert.end();
});
