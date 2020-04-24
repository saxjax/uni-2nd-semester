
const { Document } = require(`./Document`);
const { Section } = require(`./Section`);
const { Quiz } = require(`./Quiz`);
const { QuizQuestion } = require(`./QuizQuestion`);
const { Flashcard } = require(`./Flashcard`);
const { Keyword } = require(`./Keyword`);
const { User } = require(`./User`);
const { Group } = require(`./Group`);

/* Formål: Denne klasse skal levere testbare versioner af alle vores objekter (Document, Section, QuizQuestion....) som kan sammenlignes med tilsvarende data i SQLDatabasen.
* Ud fra hver klasse kan man oprette et objekt af typen (Document, Section, QuizQuestion....)
*
* For at gøre objekterne testbare stiller klassen TestData objekter til rådighed med forud definerede property-værdi par.
* Default værdierne, som bruges til at oprette testobjekterne, er defineret i  TestData constructorens property this.defaults.
*
* For hvert objekt findes der en table i SQLDatabasen (navngivet : document, section, quiz_question....).
* I hver af disse tables findes ét testobjekt med samme properties og default værdier som det tilsvarende Objekt TestData klassen.
*
* Det betyder: Et objekt kan hentes i SQLdatabasen vha. en query på en af defaultværdierne , samme objekt kan hentes i TestData klassen
* Indhold fra de to objekter kan sammenlignes, derved kan det verificeres, at vores objekter og SQLDatabasens repræsentation af samme stemmer overens.
* altså hvis jeg beder om en Section fra databasen, får jeg så en Section tilbage som indeholder de data som jeg forventer at en Section skal indeholde
*eks:
* opret et TestData Section objekt:
* const testdata = new TestData()
* testSection = testdata.section
*
* hent data på en tilsvarende testSection fra SQLDatabasen:
* const req = { session: {}, params: {}, body: {} };
* const S = new Section(req);
* const testSectionDB = await S.query(`SELECT *`, `ID_DOCUMENT_SECTION = "${testData.idDocumentSection}"`);
* TODO: gør det muligt at oprette TestData objekt på :
* -Document
* -Quiz
* -QuizQuestion
* -Flashcard
* -Keyword
* -User
* -Group
* og aktiver de tilhørende test i test.ParseSQL.js
*/
class TestData {
  constructor() {
    this.req = {
      method: `TEST`, session: {}, params: {}, body: {},
    };
    this.defaults     = {
      elementType: `test`,
      idGroup: `11111111-aaaa-bbbb-1111-111111111111`,
      idUser: `11111111-aaaa-bbbb-1111-111111111111`,
      idKeyword: `11111111-aaaa-bbbb-1111-111111111111`,
      idDocument: `11111111-aaaa-bbbb-1111-111111111111`,
      idDocumentSection: `11111111-aaaa-bbbb-1111-111111111111`,
      idSection: `11111111-aaaa-bbbb-1111-111111111111`,
      idFlashcard: `11111111-aaaa-bbbb-1111-111111111111`,
      idQuestion: `11111111-aaaa-bbbb-1111-111111111111`,
      idQuiz: `11111111-aaaa-bbbb-1111-111111111111`,
      username: `1.Testelement-user-name`,
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
      number: `0`,
      content: `1.Testelement-content`,
      teaser: `1.Testelement-teaser`,
      title: `1.Testelement-title`,
    };
    // this.doc           = new Document(this.defaults.req, this.defaults);
    this.sec           = new Section(this.req);
    // this.keyword       = new Keyword(this.defaults);
    // this.quiz          = new Quiz(this.req);
    // this.quizQuestion  = new QuizQuestion(this.defaults);
    // this.flashcard     = new Flashcard(this.defaults);
    // this.user          = new User(this.defaults);
    // this.group         = new Group(this.defaults);
  }
  // TODO: tilføj properties for Document
  // get document() {
  //   return this.doc;
  // }

  // Formål: Returnerer ALTID en Section med default værdier.
  // Anvend:const testsection = testdata.section
  get section() {
    this.sec.elementType = `section`;
    this.sec.table = `document_section`;
    this.sec.idDocument = this.defaults.idSection;
    this.sec.idSection = this.idSection;
    this.sec.idUser = this.defaults.idUser;
    this.sec.idGroup = this.defaults.idGroup;
    this.sec.number = this.defaults.number;
    this.sec.title = this.defaults.title;
    this.sec.content = this.defaults.content;
    this.sec.teaser = this.defaults.teaser;
    this.sec.keywords = this.defaults.keywords;
    return this.sec;
  }

  // TODO: tilføj properties for Keyword
  // Formål: Returnerer ALTID et Keyword med default værdier.
  // Anvend:const testkeyword = testdata.keyword
  // get keyword() {
  //   return this.keyword;
  // }
  // TODO: tilføj properties for Quiz
  // Formål: Returnerer ALTID en Quiz med default værdier.
  // Anvend:const testquiz = testdata.quiz
  // get quiz() {
  //   return this.quiz;
  // }
  // TODO: tilføj properties for QuizQuestion
  // Formål: Returnerer ALTID en QuizQuestion med default værdier.
  // Anvend:const testquizQuestion = testdata.quizQuestion
  // get quizQuestion() {
  //   return this.quizQuestion;
  // }
  // TODO: tilføj properties for Flashcard
  // Formål: Returnerer ALTID en Flashcard med default værdier.
  // Anvend:const testflashcard = testdata.flashcard
  // get flashcard() {
  //   return this.flashcard;
  // }
  // TODO: tilføj properties for User
  // Formål: Returnerer ALTID en User med default værdier.
  // Anvend:const testuser = testdata.user
  // get user() {
  //   return this.user;
  // }
  // TODO: tilføj properties for group
  // Formål: Returnerer ALTID en Group med default værdier.
  // Anvend:const testgroup = testdata.group
  // get group() {
  //   return this.group;
  // }

  /* Formål: returnerer ALTID default defineret idGroup.
  * samme procedure for alle følgende gettere.
  */
  get idGroup() {
    return this.defaults.idGroup;
  }

  get idUser() {
    return this.defaults.idUser;
  }

  get idKeyword() {
    return this.defaults.idKeyword;
  }

  get idDocument() {
    return this.defaults.idDocument;
  }

  get idDocumentSection() {
    return this.defaults.idDocumentSection;
  }

  get idSection() {
    return this.defaults.idSection;
  }

  get idFlashcard() {
    return this.defaults.idFlashcard;
  }

  get idQuestion() {
    return this.defaults.idQuestion;
  }

  get idQuiz() {
    return this.defaults.idQuiz;
  }

  get username() {
    return this.defaults.username;
  }

  get password() {
    return this.defaults.password;
  }

  get firstName() {
    return this.defaults.firstName;
  }

  get lastName() {
    return this.defaults.lastName;
  }

  get email() {
    return this.defaults.email;
  }

  get studySubject() {
    return this.defaults.studySubject;
  }

  get semester() {
    return this.defaults.semester;
  }

  get university() {
    return this.defaults.university;
  }

  get keyword() {
    return this.defaults.keyword;
  }

  get keywords() {
    return this.defaults.keywords;
  }

  get concept() {
    return this.defaults.concept;
  }

  get definition() {
    return this.defaults.definition;
  }

  get question() {
    return this.defaults.question;
  }

  get answer1() {
    return this.defaults.answer1;
  }

  get answer2() {
    return this.defaults, this.answer2;
  }

  get answer3() {
    return this.defaults.answer3;
  }

  get answer4() {
    return this.defaults.answer4;
  }

  get correctness() {
    return this.defaults.correctness;
  }

  get sectionNumber() {
    return this.defaults.number;
  }

  get content() {
    return this.defaults.content;
  }

  get teaser() {
    return this.defaults.teaser;
  }

  get title() {
    return this.defaults.title;
  }

  /* FORMÅL: returner et objekt som kun indeholder de data som er program data.
  * Fjern ekstra properties som SQLDatabase ip, port, password, connection info o.lig
  */
  // TODO: fix den så man kan skrive xxxxx.stripExtraDataFromObject()
  // stripExtraDataFromObject(Obj) {
  //   const MyObj = Obj.clone;
  //   delete MyObj.database;
  //   delete MyObj.connect;
  //   delete MyObj.table;
  //   delete MyObj.idColumnName;
  //   delete MyObj.idColumnGroup;
  //   delete MyObj.elementtype;
  //   delete MyObj.idColumnUser;
  //   return MyObj;
  // }
}

module.exports = {
  TestData,
};
