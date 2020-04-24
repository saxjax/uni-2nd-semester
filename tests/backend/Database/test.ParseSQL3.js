/* eslint no-console: off */
// nodemon tests/backend/Database/test.ParseSQL.js | .\node_modules\.bin\tap-spec

const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const test = testDecorater(tape);
const { ParseSql } = require(`../../../node/Models/AbstractClasses/ParseSQL`);
const p = new ParseSql();
let actual = true;
let expected = true;
const { Document } = require(`../../../node/Models/Document`);
const { Section } = require(`../../../node/Models/Section`);
const { Quiz } = require(`../../../node/Models/Quiz`);
const { QuizQuestion } = require(`../../../node/Models/QuizQuestion`);
const { Flashcard } = require(`../../../node/Models/Flashcard`);
const { Keyword } = require(`../../../node/Models/Keyword`);
const { User } = require(`../../../node/Models/User`);
const { TestData } = require(`../../../node/Models/TestData`);
// const req = { session: {}, params: {}, body: {} };
const testData = new TestData();

/* 0 test af parseArrayOfObjects() på data som er ukendt for parseren */
/* 0.0 - 0.6 */

test(`Test 0.x af ParseSQL i node/Database`, (assert) => {
  console.log(`Test af parseArrayOfObjects() metoden med inputData som er ukendt for parseren`);
  // Tests a første if-statement
  resetParsedData();
  const testThis = [{ data: `data` }, 1, 0, true, false, `hejse dejsa`];

  testThis.forEach((inputData, i) => {
    expected = inputData;
    resetParsedData();
    actual = p.parseArrayOfObjects(inputData);
    console.log(`test 0.${i} if in->actual == expected`);
    // console.log(inputData, actual, `==`, expected);
    // console.log(expected);
    assert.deepEqual(actual, expected,
      `{0.${i} Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere et for parseren ukendt input,
     som ikke er et array, uden at ændre i det og logge en warning i processen`);
  });

  // resetParsedData();
  // const inputData = 1;
  // expected = 1;
  // actual = p.parseArrayOfObjects(1);
  // assert.deepEqual(actual, expected,
  //   `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere arbitrÃ¦rt input,
  //      som ikke er et array, uden at Ã¦ndre i det og logge en warning i processen`);

  //   resetParsedData();
  //   expected = true;
  //   actual = p.parseArrayOfObjects(true);
  //   assert.deepEqual(actual, expected,
  //     `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere arbitrÃ¦rt input,
  //      som ikke er et array, uden at Ã¦ndre i det og logge en warning i processen`);

  //   resetParsedData();
  //   expected = false;
  //   actual = p.parseArrayOfObjects(false);
  //   assert.deepEqual(actual, expected,
  //     `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere arbitrÃ¦rt input,
  //      som ikke er et array, uden at Ã¦ndre i det og logge en warning i processen`);

  //   resetParsedData();
  //   expected = `hejsa dejsa`;
  //   actual = p.parseArrayOfObjects(`hejsa dejsa`);
  //   assert.deepEqual(actual, expected,
  //     `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere arbitrÃ¦rt input,
  //      som ikke er et array, uden at Ã¦ndre i det og logge en warning i processen`);

  //   // Tests af ukendt elementType

  //   resetParsedData();
  //   expected = [{
  //     elementType: `lmao`,
  //     data: `data`,
  //   }];
  //   actual = p.parseArrayOfObjects([{
  //     elementType: `lmao`,
  //     data: `data`,
  //   }]);
  //   assert.deepEqual(actual, expected,
  //     `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere input af typen array,
  //      med ukendt elementType i det indre objekt, uden at Ã¦ndre i det og logge en warning i processen`);

  //   console.log(`Test af parseSection() metoden`);
  //   // Test uden teaser
  //   assert.deepEqual(actual, expected,
  //     `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af inputtet med en selvkonstrueret teaser`);

  assert.end();
});


// nodemon tests/backend/Database/test.ParseSQL.js | .\node_modules\.bin\tap-spec

/* 1 test af de enkelte parse funktioner */

/* 1.1 */
// TODO:
// TESTvAF PARSE DOCUMENT
test(`Test 1. af parseXXXXXX() i node/Database ved elementType `, (assert) => {
  console.log(`1.x test af de enkelte parse funktioner`);
  console.log(`Test 1.1`);


  resetParsedData();
  const inputData = {
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

  // console.log(`Test 1.1 parseDOCUMENT()`);
  assert.deepEqual(actual, expected,
    `(1.1){ Metoden skal kunne returnere en parset version af  DOCUMENT-data`);
  assert.end();
});

/* 1.2 */
/* SECTION */
// Test med teaser
test(`Test 1. af parseXXXXXX() i node/Database ved elementType section `, (assert) => {
  resetParsedData();
  const inputData = {
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

  console.log(`Test 1.2 parseSection()`);
  assert.deepEqual(actual, expected,
    `(1.2){ Metoden skal kunne returnere en parset version af  SECTION-data`);

  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);
  assert.end();
});

/* 1.3 */
/* QUIZ */
test(`Test 1.3 af parseQuiz() i node/Database ved elementType quiz`, (assert) => {
  resetParsedData();
  const inputData = {
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

  console.log(`Test 1.3 parseQuiz()`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(1.3){ Metoden skal kunne returnere en parset version af QUIZ data`);

  assert.end();
});

/* 1.4 */
test(`Test 1.4 af parseQuizQuestion() i node/Database ved elementType quiz_question`, (assert) => {
  resetParsedData();
  const inputData = {
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

  console.log(`Test 1.4 parseQuizQuestion()`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(1.4){ Metoden skal kunne returnere en parset version af et QUIZ QUESTION data`);

  assert.end();
});

/* 1.5 */
test(`Test 1.5 af parseFlashcard() i node/Database ved elementType flashcard`, (assert) => {
  resetParsedData();
  const inputData =  {
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

  console.log(`Test 1.5 parseFlashcard()`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(1.5){ Metoden skal kunne returnere en parset version af et FLASHCARD data`);

  assert.end();
});

/* 1.6 */
test(`Test 1.6 af parseUser() i node/Database ved elementType user`, (assert) => {
  resetParsedData();
  const inputData = {
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

  console.log(`Test 1.6 parseUser()`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(1.6){ Metoden skal kunne returnere en parset version af USER data`);

  assert.end();
});

/* 1.7 */
test(`Test 1.7 af parseKeyword() i node/Database ved elementType keyword`, (assert) => {
  resetParsedData();
  const inputData = {
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

  console.log(`Test 1.7 parseKeyword()`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(1.7){ Metoden skal kunne returnere en parset version af et KEYWORD data`);

  assert.end();
});


/* 2.x test af parseArrayOfObjects() funktionen som switcher pÃ¥ indkommende elementtypes */
/* 2.1 */
/* DOCUMENT */
test(`Test 2.1 af parseArrayOfObjects(DOCUMENT) i node/Database`, (assert) => {
  console.log(`2.x Test af parseArrayOfObjects()`);

  console.log(`Test 2.1`);
  resetParsedData();
  const inputData = [{
    ID_DOCUMENT: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_USER: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_USER_GROUP: `11111111-aaaa-bbbb-1111-111111111111`,
    TITLE: `Test Title`,
    ELEMENT_TYPE: `document`,
  }];
  expected = [
    {
      idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
      idUser: `11111111-aaaa-bbbb-1111-111111111111`,
      idUserGroup: `11111111-aaaa-bbbb-1111-111111111111`,
      title: `Test Title`,
      elementType: `document`,
    },
  ];

  actual = p.parseArrayOfObjects(inputData);

  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(2.1){ Metoden skal kunne returnere en parset version af DOCUMENT data`);

  assert.end();
});

/* 2.2 */
// SECTION
test(`Test 2.2 af parseArrayOfObjects() i node/Database`, (assert) => {
  resetParsedData();
  const inputData =  [{
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

  actual = p.parseArrayOfObjects(inputData);

  console.log(`Test 2.2`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(2.2){ Metoden skal kunne returnere en parset version af SECTION data`);

  assert.end();
});

/* 2.3 */
// QUIZ
test(`Test 2.3 af parseArrayOfObjects() i node/Database ved elementType quiz`, (assert) => {
  resetParsedData();
  const inputData = [{
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

  actual = p.parseArrayOfObjects(inputData);

  console.log(`Test 2.3`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(2.3){ Metoden skal kunne returnere en parset version af QUIZ data`);

  assert.end();
});

/* 2.4 */
// QUIZQUESTION
test(`Test 2.4 af parseArrayOfObjects() i node/Database ved elementType quiz_question`, (assert) => {
  resetParsedData();
  const inputData = [{
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
  actual = p.parseArrayOfObjects(inputData);

  console.log(`Test 2.4`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(2.4){ Metoden skal kunne returnere en parset version af et QUIZ QUESTION data`);

  assert.end();
});

/* 2.5 */
// FLASHCARD
test(`Test 2.5 af parseArrayOfObjects() i node/Database ved elementType flashcard`, (assert) => {
  resetParsedData();

  const inputData = [{
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
  actual = p.parseArrayOfObjects(inputData);

  console.log(`Test 2.5`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(2.5){ Metoden skal kunne returnere en parset version af et FLASHCARD data`);

  assert.end();
});

/* 2.6 */
// KEYWORD
test(`Test 2.6 af parseArrayOfObjects() i node/Database ved elementType keyword`, (assert) => {
  resetParsedData();
  const inputData = [{
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

  actual = p.parseArrayOfObjects(inputData);

  console.log(`Test 2.6`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(2.6){ Metoden skal kunne returnere en parset version af KEYWORD data`);

  assert.end();
});

/* 2.7 */
// USER
test(`Test 2.7 af parseArrayOfObjects() i node/Database ved elementType user`, (assert) => {
  resetParsedData();

  const inputData = [{
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

  actual = p.parseArrayOfObjects(inputData);

  console.log(`Test 2.7`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(2.7){ Metoden skal kunne returnere en parset version af USER data`);

  assert.end();
});


/* 3 Test That column-names from database are the same as expected in parser */
/* 3.1 */
// DOCUMENT DB
test(`Test 3.1 af Database-setup i vores SQLdatabase, ved hentning af kolonne navne fra DOCUMENT tabellen`, async (assert) => {
  console.log(`\r\n3.x Test af de enkelte tabeller i SQL databasen\n`);

  resetParsedData();

  const req = { session: {}, params: {}, body: {} };
  const D =  new Document(req);
  let inputData = [];

  expected = [
    [
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `ID_USER` },
      { COLUMN_NAME: `ID_USER_GROUP` },
      { COLUMN_NAME: `TITLE` },
      { COLUMN_NAME: `ELEMENT_TYPE` },

    ],
  ];

  inputData = await D.queryUnparsedData(`HEAD`, `COLUMN_NAME`);
  actual = [inputData];

  console.log(`Test 3.1`);
  // console.log(`Test 3.1`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(3.1){  Metoden sammenligne en U-parset version af kolonnenavne i DOCUMENT fra sql databasen med forventet indhold`);
  assert.end();
});


// SECTION DB
/* 3.2 */
test(`Test 3.2 af Database-setup i vores SQLdatabase, ved hentning af kolonne navne fra SECTION`, async (assert) => {
  resetParsedData();

  const req = { session: {}, params: {}, body: {} };
  const S = new Section(req);
  let inputData = [];

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

  inputData = await S.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

  actual = [inputData];

  console.log(`Test 3.2`);
  // console.log(`test if input->actual==expecvalues :t`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(3.2){  Metoden skal kunne returnere en U-parset version af kolonnenavne i SECTION fra sql databasen med forventet indhold`);

  assert.end();
});


// QUIZ DB
/* 3.3 */
test(`Test 3.3 af Database-setup i vores SQLdatabase, ved hentning af kolonne navne fra quiz tabellen`, async (assert) => {
  resetParsedData();
  const req = { session: {}, params: {}, body: {} };
  const Q = new Quiz(req);
  let inputData = [];
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
  inputData = await Q.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

  actual = [inputData];

  console.log(`Test 3.3`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(3.3){  Metoden skal kunne sammenligne U-parset version af en QUIZ fra sql databasen med forventet indhold`);

  assert.end();
});


// QUIZ QUESTION DB
/* 3.4 */
test(`Test 3.4 af Database-setup i vores SQLdatabase, ved hentning af kolonne navne fra QUIZ QUESTION tabellen`, async (assert) => {
  resetParsedData();

  const req = { session: {}, params: {}, body: {} };
  const Qq = new QuizQuestion(req);
  let inputData = [];
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
  inputData = await Qq.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

  actual = [inputData];  console.log(`Test 3.4`);
  // console.log(`test if input->actual==expecvalues :t`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(3.4){  Metoden skal sammenligne en U-parset version af et QUIZ QUESTION fra sql databasen med forventet indhold`);

  assert.end();
});


// FLASHCARD DB
/* 3.5 */
test(`Test 3.5 af Database-setup i vores SQLdatabase, ved hentning af kolonne navne fra flashcard tabellen`, async (assert) => {
  resetParsedData();

  const req = { session: {}, params: {}, body: {} };
  const F = new Flashcard(req);
  let inputData = [];
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
  inputData = await F.queryUnparsedData(`HEAD`, `COLUMN_NAME`);
  actual = [inputData];

  console.log(`Test 3.5`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(3.5){  Metoden skal sammenligne en U-parset version af et FLASHCARD fra sql databasen med forventet indhold`);

  assert.end();
});


// USER DB
/* 3.6 */
test(`Test 3.6 af Database-setup i vores SQLdatabase, ved hentning af kolonne navne fra User tabellen`, async (assert) => {
  resetParsedData();
  // arrange
  let inputData = [];
  const req = { session: {}, params: {}, body: {} };
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

  // act
  inputData = await U.queryUnparsedData(`HEAD`, `COLUMN_NAME`);
  actual = [inputData];

  // assert
  console.log(`Test 3.6`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(3.6){  Metoden skal sammenligne en U-parset version af en USER fra sql databasen med forventet indhold`);

  assert.end();
});


// NOT FINISHED
// FIXME:
// KEYWORD DB
/* 3.7 */
test(`Test 3.7 af Database-setup i vores SQLdatabase, ved hentning af kolonne navne fra keyword tabellen`, async (assert) => {
  resetParsedData();

  const req = { session: {}, params: {}, body: {} };
  const K = new Keyword(req);
  let inputData = [];
  expected = [
    [
      { COLUMN_NAME: `ELEMENT_TYPE` },
      { COLUMN_NAME: `KEYWORD` },
    ],
  ];
  inputData = await K.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

  actual = [inputData];

  console.log(`Test 3.7`);
  // console.log(`test values : input->actual==expectet`);
  // console.log(inputData, `->`, actual, `==`, expected);

  assert.deepEqual(actual, expected,
    `(3.7){  Metoden skal sammenligne en U-parset version af et KEYWORD fra sql databasen med forventet indhold`);

  assert.end();
});

/* 4.x For hver elementType hentes tilhørende testelement i databasen vha query() funktionen som henter og parser elementet.
* Det returnerede objekt sammenholdes med et tilsvarende objekt fra testData klassen
* Formål: at teste om vores objekter får det data de forventer fra databasen.
* grundet at vi pt ikke bruger objekter som primær datacontainer i programmet så er her blot oprettet tests som kan aktiveres
* løbende som vi får objekterne  implementeret.
* testfunktionerne stripper testData.xxxx objektet for alle ekstra properties som ikke desideret omhandler vores primærdata data
*/


// /* 4.1 */
// // DOCUMENT DB
// test(`Test 4.1 af Database-setup i vores SQLdatabase, ved hentning af 1.test-element fra DOCUMENT`, async (assert) => {
//   resetParsedData();
//   console.log(`Test 4.1`);
//   const req = { session: {}, params: {}, body: {} };
//   const S = new Document(req);
//   let inputData = [];

//   const  TestDocument = stripExtraDataFromObject(testData.document);

//   expected = [
//     [
//       TestDocument,
//     ],
//   ];

//   inputData = await S.query(`SELECT *`, `ID_DOCUMENT = "${testData.idDocument}"`);
//   actual = [inputData];

//   assert.deepEqual(actual, expected,
//     `(4.1){  Metoden skal kunne hente et DOCUMENT ud fra et testid ${testData.idDocument} og sammenholde det hentede med vores testData.document`);

//   assert.end();
// });


// SECTION DB
/* 4.2 */
test(`Test 4.2 af Database-setup i vores SQLdatabase, ved hentning af 1.test-element fra SECTION`, async (assert) => {
  resetParsedData();
  console.log(`Test 4.2`);
  const req = { session: {}, params: {}, body: {} };
  const S = new Section(req);
  let inputData = [];

  const  TestSection = stripExtraDataFromObject(testData.section);

  expected = [
    [
      TestSection,
    ],
  ];

  inputData = await S.query(`SELECT *`, `ID_DOCUMENT_SECTION = "${testData.idDocumentSection}"`);
  actual = [inputData];

  assert.deepEqual(actual, expected,
    `(4.2){  Metoden skal kunne hente en section ud fra et testid ${testData.idDocumentSection} og sammenholde det hentede med vores testData.section`);

  assert.end();
  S.connect.end();
});

// // FIXME: bør omskrives så den bruger Quiz objekt og testData.quiz
// // QUIZ DB
// /* 4.3 */
// test(`Test 4.3 af Database-setup i vores SQLdatabase, ved hentning af 1.test-element fra QUIZ`, async (assert) => {
//   resetParsedData();
//   console.log(`Test 4.3`);
//   const req = { session: {}, params: {}, body: {} };
//   const S = new Quiz(req);
//   let inputData = [];

//   const  TestQuiz = undefined;// stripExtraDataFromObject(testData.quiz);
//   console.log(TestQuiz);

//   expected = [
//     [
//       TestQuiz,
//     ],
//   ];

//   inputData = await S.query(`SELECT *`, `ID_QUIZ = "${testData.idQuiz}"`);
//   actual = [inputData];

//   assert.deepEqual(actual, expected,
//     `(4.3){  Metoden skal kunne hente en QUIZ ud fra et testid ${testData.idQuiz} og sammenholde det hentede med vores testData.quiz`);

//   assert.end();
// });

// FIXME: bør omskrives så den bruger QuizQuestion objekt og testData.quizQuestion
// // QUIZ QUESTION DB
// /* 4.4 */
// test(`Test 4.4 af Database-setup i vores SQLdatabase, ved hentning af 1.test-element fra QUIZ QUESTION`, async (assert) => {
//   resetParsedData();
//   console.log(`Test 4.4`);
//   const req = { session: {}, params: {}, body: {} };
//   const S = new QuizQuestion(req);
//   let inputData = [];

//   const  TestQuizQuestion = stripExtraDataFromObject(testData.quizQuestion);

//   expected = [
//     [
//       TestQuizQuestion,
//     ],
//   ];

//   inputData = await S.query(`SELECT *`, `ID_QUIZ_QUESTION = "${testData.idQuestion}"`);
//   actual = [inputData];

//   assert.deepEqual(actual, expected,
//     `(4.4){  Metoden skal kunne hente en QUIZ QUESTION ud fra et testid ${testData.idQuestion} og sammenholde det hentede med vores testData.quizQuestion`);

//   assert.end();
// });


// FIXME: bør omskrives så den bruger Flashcard objekt og testData.flashcard
// // FLASHCARD DB
// /* 4.5 */
// test(`Test 4.5 af Database-setup i vores SQLdatabase, ved hentning af 1.test-element fra FLASHCARD`, async (assert) => {
//   resetParsedData();
//   console.log(`Test 4.5`);
//   const req = { session: {}, params: {}, body: {} };
//   const S = new Flashcard(req);
//   let inputData = [];

//   const  TestFlashcard = stripExtraDataFromObject(testData.flashcard);

//   expected = [
//     [
//       TestFlashcard,
//     ],
//   ];

//   inputData = await S.query(`SELECT *`, `ID_FLASHCARD = "${testData.idFlashcard}"`);
//   actual = [inputData];

//   assert.deepEqual(actual, expected,
//     `(4.5){  Metoden skal kunne hente et flashcard ud fra et testid ${testData.idFlashcard} og sammenholde det hentede med vores testData.section`);

//   assert.end();
// });


// FIXME: bør omskrives så den bruger User objekt og testData.User
// // USER DB
// /* 4.6 */
// test(`Test 4.6 af Database-setup i vores SQLdatabase, ved hentning af 1.test-element fra USER`, async (assert) => {
//   resetParsedData();
//   console.log(`Test 4.6`);
//   const req = { session: {}, params: {}, body: {} };
//   const S = new User(req);
//   let inputData = [];

//   const  TestUser = stripExtraDataFromObject(testData.user);

//   expected = [
//     [
//       TestUser,
//     ],
//   ];

//   inputData = await S.query(`SELECT *`, `ID_USER = "${testData.idUser}"`);
//   actual = [inputData];

//   assert.deepEqual(actual, expected,
//     `(4.6){  Metoden skal kunne hente en user ud fra et testid ${testData.idUser} og sammenholde det hentede med vores testData.user`);

//   assert.end();
// });

// // // KEYWORD DB
// // /* 4.7 */
// test(`Test 4.7 af Database-setup i vores SQLdatabase, ved hentning af 1.test-element fra KEYWORD`, async (assert) => {
//   resetParsedData();
//   console.log(`Test 4.7`);
//   const req = { session: {}, params: {}, body: {} };
//   const S = new Keyword(req);
//   let inputData = [];

//   const  TestKeyword = stripExtraDataFromObject(testData.keyword);

//   expected = [
//     [
//       TestKeyword,
//     ],
//   ];

//   inputData = await S.query(`SELECT *`, `ID_KEYWORD = "${testData.idKeyword}"`);
//   actual = [inputData];

//   assert.deepEqual(actual, expected,
//     `(4.7){  Metoden skal kunne hente en keyword ud fra et testid ${testData.idKeyword} og sammenholde det hentede med vores testData.keyword`);

//   assert.end();
// });


// // function testArrayOfObjects(array1, array2, callback) {
// //   array1[0].forEach((obj1, i) => {
// //     const obj2 = array2[0][i];
// //     const array1Val = obj1[Object.keys(obj1)[0]];
// //     const array2Val = obj2[Object.keys(obj1)[0]];

// //     callback(array1Val, array2Val);
// //   });
// // }

function resetParsedData() {
  p.parsedData = [];
}

function stripExtraDataFromObject(Obj) {
  const tempObj = Obj;
  delete tempObj.database;
  delete tempObj.connect;
  delete tempObj.table;
  delete tempObj.idColumnName;
  delete tempObj.idColumnGroup;
  delete tempObj.elementtype;
  delete tempObj.idColumnUser;
  return tempObj;
}
