/* eslint-disable guard-for-in */
/* eslint no-console: off */
const path = require(`path`);
const { Section } = require(`../Section/Section.js`);
const { Evaluation } = require(`../Evaluation/Evaluation.js`);
const { ParseSql } = require(`../Database/ParseSQL`);
const { User } = require(`../User/User.js`);


class ViewController {
  constructor(req) {
    this.name = `ViewController`;
    this.ejs = {};
    this.validated = false;
    this.root = __dirname.slice(0, -(`node/${this.name}`.length));
    this.request = req;
  }

  homePage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/home.ejs`);
    res.render(this.ejs);
  }

  registerPage(req, res) {
    const Registered = new User(req);
    if (Registered.alreadyLoggedIn()) {
      res.redirect(`/`);
    }
    else {
      this.ejs = path.join(`${this.root}/www/views/register.ejs`);
      res.render(this.ejs);
    }
  }

  loginPage(req, res) {
    if (req.session.loggedin === true) {
      this.ejs = path.join(`${this.root}/www/views/home.ejs`);
    }
    else {
      this.ejs = path.join(`${this.root}/www/views/login.ejs`);
    }
    res.render(this.ejs);
  }

  // viser alle oprettede evalueringer
  async evalueringerPage(req, res) {
    // get data from database
    const doc = new Evaluation();
    const parseSql = new ParseSql();
    const data = await doc.getAllEvaluations();

    // parse data from sqlpacket to OUR packet type
    const parsedData = await parseSql.parser(data);

    // populate Quizzes and flashcards based on cardtype
    const Quizzes = [];
    const Flashcards = [];

    for (const index in parsedData) {
      if (parsedData[index].elementtype === `flashcard`) {
        Flashcards.push(parsedData[index]);
      }
      else if (parsedData[index].elementtype === `quiz`) {
        Quizzes.push(parsedData[index]);
      }
    }

    // make flashcards and quizzes availabel to HTML page
    this.ejs = path.join(`${this.root}/www/views/evalueringer.ejs`);
    res.render(this.ejs, { Flashcards, Quizzes });
  }


  async evalueringerTypePage(req, res) {
    const doc = new Evaluation();
    const parseSql = new ParseSql();
    let data = [];
    let parsedData = [];

    if (req.params.type === `flashcard`) {
      const id = req.params.idflashcard;
      data = await doc.getFlashcard(id);
      parsedData = await parseSql.parser(data);
      this.ejs = path.join(`${this.root}/www/views/evalueringerFlashcard.ejs`);
      res.render(this.ejs, { flashcard: parsedData });
    }
    else if (req.params.type === `quiz`) {
      const id = req.params.idquiz;
      data = await doc.getQuiz(id);
      parsedData = await parseSql.parser(data);

      this.ejs = path.join(`${this.root}/www/views/evalueringerQuiz.ejs`);
      res.render(this.ejs, { quiz: parsedData });
    }
  }

  // viser alle oprettede sections
  async rapportPage(req, res) {
    // //test data
    // let mydata = sectionDatabaseJakob
    const sec = new Section();
    let mydata = [];
    const data = await sec.getAllSections();
    const parseSql = new ParseSql();

    // parse data from sqlpacket to OUR packet type
    mydata = await parseSql.parser(data);

    // make list of all sections availabel as html on page
    this.ejs = path.join(`${this.root}/www/views/rapport.ejs`);
    res.render(this.ejs, { Afsnit: mydata });
  }

  // viser én section
  async rapportSectionPage(req, res) {
    // get data from database
    const parseSql = new ParseSql();
    const id = req.params.iddocument_section;
    console.log(id);
    const section = new Section();
    const evaluering = new Evaluation();
    const evaluations = await evaluering.getEvalForSection(id);
    const parsedEvaluations = await parseSql.parser(evaluations);

    const currentSection = await section.getSection(id);
    console.log(`linie 186`);
    console.log(currentSection);
    const parsedSection = await parseSql.parser(currentSection);
    console.log(parsedSection);
    console.log(`parsed`);


    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    res.render(this.ejs, { evaluations: parsedEvaluations, section: parsedSection  });
  }

  uploadPage(req, res) {
    if (req.params.type === `evalueringer`) {
      this.ejs = path.join(`${this.root}/www/views/evalueringerUpload.ejs`);
      res.render(this.ejs);
    }
    else if (req.params.type === `rapport`) {
      this.ejs = path.join(`${this.root}/www/views/rapportUpload.ejs`);
      res.render(this.ejs);
    }
  }
}

module.exports = {
  ViewController,
};

// convert card information to HTML
// based on cardtype , section,quiz,Flashcards
// input: list of cards (section-,quiz-,Flashcards-)
// output: HTML
function createlist(elementList) {
  // console.log("create list:");
  // console.log(elementList);

  let HTML = `
    <div class="deck"><h1>A Deck of Cards</h1>
    <a href="javascript:void(0)" class="btn" onclick="shuffle()">Shuffle</a>
    <div id="deck">`;

  const HTMLEnd = `</div></div>`;

  // eslint-disable-next-line no-restricted-syntax
  for (let index = 0; index < elementList.length; index++)  {
    switch (elementList[index].elementtype) {
      case `section`:
        HTML += createSectionHTML(elementList[index]);
        break;

      case `quiz`:
        HTML += createQuizHTML(elementList[index]);
        break;

      case `flashcard`:
        HTML += createSectionHTML(elementList[index]);
        break;

      default:  break;
    }
    HTML += `</div></a>`;
  }

  HTML += HTMLEnd;
  // console.log(HTML);
  return HTML;
}

function createFlashcardHTML(flashcardData) {
  let HTML = ``;
  // console.log(flashcardData.keywords)
  HTML += `<a href="/evalueringer/flashcard/${flashcardData.iddocument}" >`;
  HTML += `<div class="card">`;
  HTML += `<div class="elementType${flashcardData.elementtype}${flashcardData.iddocument}">${flashcardData.title}</div>`;
  HTML += `<div class="FlashcardBegreb">${keywords}</div>`;
  HTML += `<a href="javascript:void(0)" class="btn" onclick="ShowFlashcardDefinition()">Turn Card</a>`;
  HTML += `<div class="FlashcardDefinition">${flashcardData.definition}</div>`;
  // HTML += `<div class="contentFlashcard">${flashcardData.content}</div>`;

  return HTML;
}

function createQuizHTML(quizData) {
  let HTML = ``;

  HTML += `<a href="/evalueringer/quiz/${quizData.iddocument}" >`;
  HTML += `<div class="card">`;
  HTML += `<div class="elementType${quizData.elementtype}${quizData.iddocument}">${quizData.title}</div>`;
  HTML += `<div class="value">keywords:</div><div>`;
  HTML += `<div class="keywords">${quizData.keywords}</div></div>`;
  HTML += `<div class="contentQuiz">${quizData.question}</div>`;
  for (const i in quizData.answers) {
    HTML += `<a href="javascript:void(0)" class="btn" onclick="ShowFlashcardDefinition()"><p>Answer#${i}:${quizData.answers[i]}</p></a>`;
  }
  return HTML;
}

function createSectionHTML(sectionData) {
  let HTML = ``;

  HTML += `<a href="/rapport/${sectionData.iddocument}" >`;
  HTML += `<div class="card">`;
  HTML += `<div class="elementType${sectionData.elementtype}">${sectionData.title}</div>`;
  HTML += `<div class="value">keywords:</div><div>`;
  HTML += `<div class="keywords">${sectionData.keywords}</div></div>`;
  HTML += `<div class="contentSection">${sectionData.content}</div>`;

  return HTML;
}
