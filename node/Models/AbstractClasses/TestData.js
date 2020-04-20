const { Document } = require(`./Document`);
const { Section } = require(`./Section`);
const { Quiz } = require(`./Quiz`);
const { QuizQuestion } = require(`./QuizQuestion`);
const { Flashcard } = require(`./Flashcard`);
const { Keyword } = require(`./Keyword`);
const { User } = require(`./User`);
const { Group } = require(`./Group`);


class TestData {
  constructor() {
    this.req = {
      method: `TEST`, session: {}, params: {}, body: {},
    };
    this.defaults     = {
      // elementtype: ``,
      idGroup: `11111111-aaaa-bbbb-1111-111111111111`,
      idUser: `11111111-aaaa-bbbb-1111-111111111111`,
      idKeyword: `11111111-aaaa-bbbb-1111-111111111111`,
      idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
      idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
      idSection: `11111111-aaaa-bbbb-1111-111111111111`,
      idFlashcard: `11111111-aaaa-bbbb-1111-111111111111`,
      idQuestion: `11111111-aaaa-bbbb-1111-111111111111`,
      idQuiz: `11111111-aaaa-bbbb-1111-111111111111`,
      userName: `1.Testelement-user-name`,
      password: `1.Testelement-password`,
      firstName: `1.Testelement-first-name`,
      lastName: `1.Testelement-last-name`,
      email: `1.Testelement-@email.dk`,
      studySubject: `1.Testelement-study-subject`,
      semester: `0`,
      university: `1.Testelement-university`,
      keyword: `1.Testelement-keyword`,
      keywords: `1.Testelement-keywords`,
      concept: `1.Testelement-concept`,
      definition: `1.Testelement-definition`,
      question: `1.Testelement-question`,
      answer1: `1.Testelement-answ1`,
      answer2: `1.Testelement-answ2`,
      answer3: `1.Testelement-answ3`,
      answer4: `1.Testelement-answ4`,
      correctness: `0000`,
      sectionNumber: 0,
      content: `1.Testelement-content`,
      teaser: `1.Testelement-teaser`,
      title: `1.Testelement-title`,
    };
    // this.doc           = new Document(this.defaults.req, this.defaults);
    // this.sec           = new Section(this.defaults.req, this.defaults);
    // this.keyword       = new Keyword(this.defaults);
    // this.quiz          = new Quiz(this.defaults);
    // this.quizQuestion  = new QuizQuestion(this.defaults);
    // this.flashcard     = new Flashcard(this.defaults);
    // this.user          = new User(this.defaults);
    // this.group         = new Group(this.defaults);
  }

  // get document() {
  //   return this.doc;
  // }

  // get section() {
  //   return this.sec;
  // }

  // get keyword() {
  //   return this.keyword;
  // }

  get quiz() {
    return this.quiz;
  }

  get quizQuestion() {
    return this.quizQuestion;
  }

  get flashcard() {
    return this.flashcard;
  }

  get user() {
    return this.user;
  }

  get group() {
    return this.group;
  }

  get idGroup() {
    return this.defaults.idGroup;
  }

  get idUser() {
    return this.defaults;
  }

  get idKeyword() {
    return this.defaults;
  }

  get idDocument() {
    return this.defaults;
  }

  get idDocumentSection() {
    return this.defaults;
  }

  get idSection() {
    return this.defaults;
  }

  get idFlashcard() {
    return this.defaults;
  }

  get idQuestion() {
    return this.defaults;
  }

  get idQuiz() {
    return this.defaults;
  }

  get userName() {
    return this.defaults;
  }

  get password() {
    return this.defaults;
  }

  get firstName() {
    return this.defaults;
  }

  get lastName() {
    return this.defaults;
  }

  get email() {
    return this.defaults;
  }

  get studySubject() {
    return this.defaults;
  }

  get semester() {
    return this.defaults;
  }

  get university() {
    return this.defaults;
  }

  get keyword() {
    return this.defaults;
  }

  get keywords() {
    return this.defaults;
  }

  get concept() {
    return this.defaults;
  }

  get definition() {
    return this.defaults;
  }

  get question() {
    return this.defaults;
  }

  get answer1() {
    return this.defaults;
  }

  get answer2() {
    return this.defaults;
  }

  get answer3() {
    return this.defaults;
  }

  get answer4() {
    return this.defaults;
  }

  get correctness() {
    return this.defaults;
  }

  get sectionNumber() {
    return this.defaults;
  }

  get content() {
    return this.defaults;
  }

  get teaser() {
    return this.defaults;
  }

  get title() {
    return this.defaults;
  }
}

module.exports = {
  TestData,
};
