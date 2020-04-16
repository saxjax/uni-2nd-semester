/* eslint no-console: off */
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


test(`Test af parseSection i node/Database`, (assert) => {
  expected = {
    elementtype: `section`,
    idDocument: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    idSection: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    sectionNumber: 9.9,
    title: `fiktiv viden`,
    content: `lidt tekst 3`,
    teaser: `lidt tekst 3`,
    keywords: undefined,
  };
  actual = p.parseSection({
    ID_DOCUMENT_SECTION: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    ID_DOCUMENT: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    SECTION_NUMBER: 9.9,
    SECTION_TITLE: `fiktiv viden`,
    SECTION_TEASER: null,
    SECTION_CONTENT: `lidt tekst 3`,
    ELEMENT_TYPE: `section`,
  });

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af en section fra sql databasen`);

  assert.end();
});

test(`Test af parseSection i node/Database ved elementtype quiz`, (assert) => {
  expected = {
    elementtype: `quiz`,
    idQuiz: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    idDocument: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    idDocumentSection: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    title: `fiktiv viden`,
    keywords: undefined,
  };
  actual = p.parseQuiz({
    ID_QUIZ: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    ID_DOCUMENT: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    ID_DOCUMENT_SECTION: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    SECTION_TITLE: `fiktiv viden`,
    ELEMENT_TYPE: `quiz`,
  });

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af en quiz fra sql databasen`);

  assert.end();
});

test(`Test af parseSection i node/Database ved elementtype quiz_question`, (assert) => {
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
  actual = p.parseQuizQuestion({
    ID_QUIZ_QUESTION: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_QUIZ: `11111111-aaaa-bbbb-1111-111111111111`,
    QUESTION: `hvad er?`,
    ANSWER_1: `ans1`,
    ANSWER_2: `ans2`,
    ANSWER_3: `ans3`,
    ANSWER_4: `ans4`,
    CORRECT_ANSWER: `0000`,
    ELEMENT_TYPE: `quiz_question`,
  });

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af et quiz_question fra sql databasen`);

  assert.end();
});

test(`Test af parseSection i node/Database ved elementtype flashcard`, (assert) => {
  expected = {
    elementtype: `flashcard`,
    idFlashcard: `11111111-aaaa-bbbb-1111-111111111111`,
    idUser: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
    concept: `hvad er?`,
    definition: `ans1`,
    correctness: `1`,

  };
  actual = p.parseFlashcard({
    ID_FLASHCARD: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_USER: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT_SECTION: `11111111-aaaa-bbbb-1111-111111111111`,
    CONCEPT: `hvad er?`,
    DEFINITION: `ans1`,
    CORRECT_ANSWER: `1`,
    ELEMENT_TYPE: `flashcard`,
  });

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af et flashcard fra sql databasen`);

  assert.end();
});

test(`Test af parseSection i node/Database ved elementtype keyword`, (assert) => {
  expected = {
    idKeyword: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
    keyword: `keyword Test`,
    elementtype: `keyword`,
  };
  actual = p.parseKeyword({
    ID_KEYWORD: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT_SECTION: `11111111-aaaa-bbbb-1111-111111111111`,
    KEYWORD: `keyword Test`,
    ELEMENT_TYPE: `keyword`,
  });

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af et keyword fra sql databasen`);

  assert.end();
});

test(`Test af parseSection i node/Database ved elementtype user`, (assert) => {
  expected = {
    elementtype: `user`,
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
  actual = p.parseUser({
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
  });

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af en user fra sql databasen`);

  assert.end();
});


/* test af parse funktionen som switcher pÃ¥ indkommende elementtypes */

test(`Test af parse i node/Database`, (assert) => {
  p.reset();
  expected = [{
    elementtype: `section`,
    idDocument: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    idSection: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    sectionNumber: 9.9,
    title: `fiktiv viden`,
    content: `lidt tekst 3`,
    teaser: `lidt tekst 3`,
    keywords: undefined,
  }];
  actual = p.parse([{
    ID_DOCUMENT_SECTION: `78c14a9a-6f59-11ea-9983-2c4d54532c7a`,
    ID_DOCUMENT: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    SECTION_NUMBER: 9.9,
    SECTION_TITLE: `fiktiv viden`,
    SECTION_TEASER: null,
    SECTION_CONTENT: `lidt tekst 3`,
    ELEMENT_TYPE: `section`,
  }]);

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af en section fra sql databasen`);

  assert.end();
});

test(`Test af parse i node/Database ved elementtype quiz`, (assert) => {
  p.reset();
  expected = [{
    elementtype: `quiz`,
    idQuiz: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
    title: `fiktiv quiz viden`,
    keywords: undefined,
  }];
  actual = p.parse([{
    ID_QUIZ: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT_SECTION: `11111111-aaaa-bbbb-1111-111111111111`,
    SECTION_TITLE: `fiktiv quiz viden`,
    ELEMENT_TYPE: `quiz`,
  }]);

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af en quiz fra sql databasen`);

  assert.end();
});

test(`Test af parse i node/Database ved elementtype quiz_question`, (assert) => {
  p.reset();
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
  actual = p.parse([{
    ID_QUIZ_QUESTION: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_QUIZ: `11111111-aaaa-bbbb-1111-111111111111`,
    QUESTION: `hvad er?`,
    ANSWER_1: `ans1`,
    ANSWER_2: `ans2`,
    ANSWER_3: `ans3`,
    ANSWER_4: `ans4`,
    CORRECT_ANSWER: `0000`,
    ELEMENT_TYPE: `quiz_question`,
  }]);

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af et quiz_question fra sql databasen`);

  assert.end();
});

test(`Test af parse i node/Database ved elementtype flashcard`, (assert) => {
  p.reset();
  expected = [{
    elementtype: `flashcard`,
    idFlashcard: `11111111-aaaa-bbbb-1111-111111111111`,
    idUser: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
    concept: `hvad er?`,
    definition: `ans1`,
    correctness: `1`,

  }];
  actual = p.parse([{
    ID_FLASHCARD: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_USER: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT_SECTION: `11111111-aaaa-bbbb-1111-111111111111`,
    CONCEPT: `hvad er?`,
    DEFINITION: `ans1`,
    CORRECT_ANSWER: `1`,
    ELEMENT_TYPE: `flashcard`,
  }]);

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af et flashcard fra sql databasen`);

  assert.end();
});

test(`Test af parse i node/Database ved elementtype keyword`, (assert) => {
  p.reset();

  expected = [{
    idKeyword: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
    keyword: `keyword Test`,
    elementtype: `keyword`,
  }];
  actual = p.parse([{
    ID_KEYWORD: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT: `11111111-aaaa-bbbb-1111-111111111111`,
    ID_DOCUMENT_SECTION: `11111111-aaaa-bbbb-1111-111111111111`,
    KEYWORD: `keyword Test`,
    ELEMENT_TYPE: `keyword`,
  }]);

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af et keyword fra sql databasen`);

  assert.end();
});

test(`Test af parse i node/Database ved elementtype user`, (assert) => {
  p.reset();

  expected = [{
    elementtype: `user`,
    idUser: `11111111-aaaa-bbbb-1111-111111111111`,
    userName: `Test user`,
    // password: `****`,
    firstName: `test fornavn`,
    lastName: `test efternavn`,
    email: `test@email.com`,
    studySubject: `software`,
    semester: `2`,
    university: `MIT`,
  }];
  actual = p.parse([{
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
  }]);

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af en user fra sql databasen`);

  assert.end();
});

// DOCUMENT DB
/* Test That column-names from database are the same as expected in parser */

// test(`Test af Database-setup i vores SQLdatabase, ved hentning af første element fra DOCUMENT tabellen, udtræk kolonnenavne`, async (assert) => {
//   p.reset();

//   expected = [
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_USER` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `TITLE` },

//     ],
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `KEYWORDS` },
//       { COLUMN_NAME: `SECTION_CONTENT` },
//       { COLUMN_NAME: `SECTION_NUMBER` },
//       { COLUMN_NAME: `SECTION_TEASER` },
//       { COLUMN_NAME: `SECTION_TITLE` },
//     ],
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
//       { COLUMN_NAME: `ID_QUIZ` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `SECTION_TITLE` },
//     ],
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
//       { COLUMN_NAME: `ID_QUIZ` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `SECTION_TITLE` },
//     ],
//     [
//       { COLUMN_NAME: `CONCEPT` },
//       { COLUMN_NAME: `DEFINITION` },
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
//       { COLUMN_NAME: `ID_FLASHCARD` },
//       { COLUMN_NAME: `ID_USER` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//     ],
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `EMAIL` },
//       { COLUMN_NAME: `FIRST_NAME` },
//       { COLUMN_NAME: `ID_USER` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `LAST_NAME` },
//       { COLUMN_NAME: `PASSWORD` },
//       { COLUMN_NAME: `SEMESTER` },
//       { COLUMN_NAME: `STUDY_SUBJECT` },
//       { COLUMN_NAME: `UNIVERSITY` },
//       { COLUMN_NAME: `USER_NAME` },
//     ],
//     [],
//   ];
//   const req = { session: {}, params: {}, body: {} };
//   const D = new Document(req);
//   const Ddata = await D.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const S = new Section(req);
//   const Sdata = await S.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const Q = new Quiz(req);
//   const Qdata = await Q.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const Qq = new QuizQuestion(req);
//   const Qqdata = await Qq.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const F = new Flashcard(req);
//   const Fdata = await F.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const U = new User(req);
//   const Udata = await U.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const K = new Keyword(req);
//   const Kdata = await K.queryUnparsedData(`HEAD`, `COLUMN_NAME`);


//   actual = [Object.values(Ddata), Sdata, Qdata, Qqdata, Fdata, Udata, Kdata];
//   // console.log([Ddata]); // , Sdata, Qdata, Qqdata, Fdata, Udata, Kdata]);


//   assert.deepEqual(actual, expected,
//     `{Forventet: ${JSON.stringify(expected)} Reel: ${JSON.stringify(actual)}} Metoden skal kunne returnere en parset version af en user fra sql databasen`);

//   assert.end();
// });


// SECTION DB
// test(`Test af Database-setup i vores SQLdatabase, ved hentning af første element fra SECTION, udtræk kolonnenavne`, async (assert) => {
//   p.reset();

//   expected = [
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_USER` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `TITLE` },

//     ],
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `KEYWORDS` },
//       { COLUMN_NAME: `SECTION_CONTENT` },
//       { COLUMN_NAME: `SECTION_NUMBER` },
//       { COLUMN_NAME: `SECTION_TEASER` },
//       { COLUMN_NAME: `SECTION_TITLE` },
//     ],
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
//       { COLUMN_NAME: `ID_QUIZ` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `SECTION_TITLE` },
//     ],
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
//       { COLUMN_NAME: `ID_QUIZ` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `SECTION_TITLE` },
//     ],
//     [
//       { COLUMN_NAME: `CONCEPT` },
//       { COLUMN_NAME: `DEFINITION` },
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
//       { COLUMN_NAME: `ID_FLASHCARD` },
//       { COLUMN_NAME: `ID_USER` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//     ],
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `EMAIL` },
//       { COLUMN_NAME: `FIRST_NAME` },
//       { COLUMN_NAME: `ID_USER` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `LAST_NAME` },
//       { COLUMN_NAME: `PASSWORD` },
//       { COLUMN_NAME: `SEMESTER` },
//       { COLUMN_NAME: `STUDY_SUBJECT` },
//       { COLUMN_NAME: `UNIVERSITY` },
//       { COLUMN_NAME: `USER_NAME` },
//     ],
//     [],
//   ];
//   const req = { session: {}, params: {}, body: {} };
//   const D = new Document(req);
//   const Ddata = await D.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const S = new Section(req);
//   const Sdata = await S.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const Q = new Quiz(req);
//   const Qdata = await Q.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const Qq = new QuizQuestion(req);
//   const Qqdata = await Qq.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const F = new Flashcard(req);
//   const Fdata = await F.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const U = new User(req);
//   const Udata = await U.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const K = new Keyword(req);
//   const Kdata = await K.queryUnparsedData(`HEAD`, `COLUMN_NAME`);


//   actual = [Object.values(Ddata), Sdata, Qdata, Qqdata, Fdata, Udata, Kdata];
//   // console.log([Ddata]); // , Sdata, Qdata, Qqdata, Fdata, Udata, Kdata]);


//   assert.deepEqual(actual, expected,
//     `{Forventet: ${JSON.stringify(expected)} Reel: ${JSON.stringify(actual)}} Metoden skal kunne returnere en parset version af en user fra sql databasen`);

//   assert.end();
// });


// QUIZ DB
test(`Test af Database-setup i vores SQLdatabase, ved hentning af første element quiz tabellen, udtræk kolonnenavne`, async (assert) => {
  p.reset();

  expected = [
    [
      { COLUMN_NAME: `ELEMENT_TYPE` },
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
      { COLUMN_NAME: `ID_QUIZ` },
      { COLUMN_NAME: `ID_USER_GROUP` },
      { COLUMN_NAME: `SECTION_TITLE` },
    ],
  ];
  const req = { session: {}, params: {}, body: {} };

  const Q = new Quiz(req);
  const Qdata = await Q.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

  actual = [Qdata];
  // console.log([Ddata]); // , Sdata, Qdata, Qqdata, Fdata, Udata, Kdata]);


  assert.deepEqual(actual, expected,
    `{Forventet: ${JSON.stringify(expected)} Reel: ${JSON.stringify(actual)}} Metoden skal kunne returnere en parset version af en user fra sql databasen`);

  assert.end();
});


// QUIZ QUESTION DB
// test(`Test af Database-setup i vores SQLdatabase, ved hentning af første element fra QUIZ QUESTION tabellen, udtræk kolonnenavne`, async (assert) => {
//   p.reset();

//   expected = [
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_USER` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `TITLE` },

//     ],
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `KEYWORDS` },
//       { COLUMN_NAME: `SECTION_CONTENT` },
//       { COLUMN_NAME: `SECTION_NUMBER` },
//       { COLUMN_NAME: `SECTION_TEASER` },
//       { COLUMN_NAME: `SECTION_TITLE` },
//     ],
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
//       { COLUMN_NAME: `ID_QUIZ` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `SECTION_TITLE` },
//     ],
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
//       { COLUMN_NAME: `ID_QUIZ` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `SECTION_TITLE` },
//     ],
//     [
//       { COLUMN_NAME: `CONCEPT` },
//       { COLUMN_NAME: `DEFINITION` },
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `ID_DOCUMENT` },
//       { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
//       { COLUMN_NAME: `ID_FLASHCARD` },
//       { COLUMN_NAME: `ID_USER` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//     ],
//     [
//       { COLUMN_NAME: `ELEMENT_TYPE` },
//       { COLUMN_NAME: `EMAIL` },
//       { COLUMN_NAME: `FIRST_NAME` },
//       { COLUMN_NAME: `ID_USER` },
//       { COLUMN_NAME: `ID_USER_GROUP` },
//       { COLUMN_NAME: `LAST_NAME` },
//       { COLUMN_NAME: `PASSWORD` },
//       { COLUMN_NAME: `SEMESTER` },
//       { COLUMN_NAME: `STUDY_SUBJECT` },
//       { COLUMN_NAME: `UNIVERSITY` },
//       { COLUMN_NAME: `USER_NAME` },
//     ],
//     [],
//   ];
//   const req = { session: {}, params: {}, body: {} };
//   const D = new Document(req);
//   const Ddata = await D.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const S = new Section(req);
//   const Sdata = await S.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const Q = new Quiz(req);
//   const Qdata = await Q.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const Qq = new QuizQuestion(req);
//   const Qqdata = await Qq.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const F = new Flashcard(req);
//   const Fdata = await F.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const U = new User(req);
//   const Udata = await U.queryUnparsedData(`HEAD`, `COLUMN_NAME`);

//   const K = new Keyword(req);
//   const Kdata = await K.queryUnparsedData(`HEAD`, `COLUMN_NAME`);


//   actual = [Object.values(Ddata), Sdata, Qdata, Qqdata, Fdata, Udata, Kdata];
//   // console.log([Ddata]); // , Sdata, Qdata, Qqdata, Fdata, Udata, Kdata]);


//   assert.deepEqual(actual, expected,
//     `{Forventet: ${JSON.stringify(expected)} Reel: ${JSON.stringify(actual)}} Metoden skal kunne returnere en parset version af en user fra sql databasen`);

//   assert.end();
// });

// FLASHCARD DB
test(`Test af Database-setup i vores SQLdatabase, ved hentning af første element fra flashcard tabellen, udtræk kolonnenavne`, async (assert) => {
  p.reset();

  expected = [

    [
      { COLUMN_NAME: `CONCEPT` },
      { COLUMN_NAME: `DEFINITION` },
      { COLUMN_NAME: `ELEMENT_TYPE` },
      { COLUMN_NAME: `ID_DOCUMENT` },
      { COLUMN_NAME: `ID_DOCUMENT_SECTION` },
      { COLUMN_NAME: `ID_FLASHCARD` },
      { COLUMN_NAME: `ID_USER` },
      { COLUMN_NAME: `ID_USER_GROUP` },
    ],
  ];
  const req = { session: {}, params: {}, body: {} };
  const F = new Flashcard(req);
  const Fdata = await F.queryUnparsedData(`HEAD`, `COLUMN_NAME`);
  actual = [Fdata];
  // console.log([Ddata]); // , Sdata, Qdata, Qqdata, Fdata, Udata, Kdata]);


  assert.deepEqual(actual, expected,
    `{Forventet: ${JSON.stringify(expected)} Reel: ${JSON.stringify(actual)}} Metoden skal kunne returnere en parset version af en user fra sql databasen`);

  assert.end();
});

// USER DB
test(`Test af Database-setup i vores SQLdatabase, ved hentning af første element fra User tabellen, udtræk kolonnenavne`, async (assert) => {
  p.reset();
  // arrange
  let Udata = [];
  const req = { session: {}, params: {}, body: {} };
  const U = new User(req);

  expected = [
    [
      { COLUMN_NAME: `ELEMENT_TYPE` },
      { COLUMN_NAME: `EMAIL` },
      { COLUMN_NAME: `FIRST_NAME` },
      { COLUMN_NAME: `ID_USER` },
      { COLUMN_NAME: `ID_USER_GROUP` },
      { COLUMN_NAME: `LAST_NAME` },
      { COLUMN_NAME: `PASSWORD` },
      { COLUMN_NAME: `SEMESTER` },
      { COLUMN_NAME: `STUDY_SUBJECT` },
      { COLUMN_NAME: `UNIVERSITY` },
      { COLUMN_NAME: `USER_NAME` },
    ],
  ];

  // act
  Udata = await U.queryUnparsedData(`HEAD`, `COLUMN_NAME`);
  actual = [Udata];

  // assert
  assert.deepEqual(actual, expected,
    `{Forventet: ${JSON.stringify(expected)} Reel: ${JSON.stringify(actual)}} Metoden skal kunne returnere en parset version af en user fra sql databasen`);

  assert.end();
});

// NOT FINISHED
// FIXME:
// KEYWORD DB
test(`Test af Database-setup i vores SQLdatabase, ved hentning af første element fra keyword tabellen, udtræk kolonnenavne`, async (assert) => {
  p.reset();

  const req = { session: {}, params: {}, body: {} };
  const K = new Keyword(req);
  let Kdata = [];
  expected = [
    [
      { COLUMN_NAME: `ELEMENT_TYPE` },
      { COLUMN_NAME: `KEYWORD` },
    ],
  ];
  Kdata = await K.queryUnparsedData(`HEAD`, `COLUMN_NAME`);


  actual = [Kdata];
  // console.log([Ddata]); // , Sdata, Qdata, Qqdata, Fdata, Udata, Kdata]);


  assert.deepEqual(actual, expected,
    `{Forventet: ${JSON.stringify(expected)} Reel: ${JSON.stringify(actual)}} Metoden skal kunne returnere en parset version af en user fra sql databasen`);

  assert.end();
});
