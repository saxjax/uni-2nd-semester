/* eslint no-console: off */
const tape = require(`tape`);
const testDecorater = require(`tape-promise`).default;
const test = testDecorater(tape);
const { ParseSql } = require(`../../../node/Models/AbstractClasses/ParseSQL.js`);
const p = new ParseSql();
let actual = true;
let expected = true;

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
    idUser: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
    idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
    keyword: `keyword Test`,
    elementtype: `keyword`,
  };
  actual = p.parseKeyword({
    ID_USER: `11111111-aaaa-bbbb-1111-111111111111`,
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
    password: `****`,
    firstName: `test fornavn`,
    lastName: `test efternavn`,
    email: `test@email.com`,
    studySubject: `software`,
    semester: `2`,
    university: `MIT`,
  };
  actual = p.parseKeyword({
    ELEMENT_TYPE: `user`,
    ID_USER: `11111111-aaaa-bbbb-1111-111111111111`,
    USERNAME: `Test user`,
    PASSWORD: `****`,
    FIRSTNAME: `test fornavn`,
    LASTNAME: `test efternavn`,
    EMAIL: `test@email.com`,
    STUDY_SUBJECT: `software`,
    SEMESTER: `2`,
    UNIVERSITY: `MIT`,
  });

  assert.deepEqual(actual, expected,
    `{Forventet: ${expected} Reel: ${actual}} Metoden skal kunne returnere en parset version af en user fra sql databasen`);

  assert.end();
});
