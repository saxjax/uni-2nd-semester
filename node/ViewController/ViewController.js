/* eslint-disable guard-for-in */
/* eslint no-console: off */
const path = require(`path`);
const { Section } = require(`../Section/Section.js`);
const { Evaluation } = require(`../Evaluation/Evaluation.js`);
const parseSql = require(`../Database/ParseSQL`);
const { User } = require(`../User/User.js`);

// Mock Data
const sectionDatabaseJakob = {
  2.1: {
    iddocument: `83f5173d-685a-11ea-9793-00ff63f710b8`,
    elementType: `section`,
    content: `her er de første ti linier af en sektion`,
    keywords: [`vidensdeling`, `feed-up`, `feed-forward`],
  },
  2.2: {
    iddocument: `0f64f6b9-6dda-11ea-9983-2c4d54532c7a`,
    elementType: `section`,
    content: `her er de første ti linier af en sektion`,
    keywords: [`studier`, `evaluering`, `formativ`, `summativ`],
  },
  2.3: {
    iddocument: `0f69a258-6dda-11ea-9983-2c4d54532c7a`,
    elementType: `section`,
    content: `her er de første ti linier af en sektion`,
    keywords: [`metoder`, `active recall`, `spaced repetition`],
  },
  2.4: {
    iddocument: `0f6ed223-6dda-11ea-9983-2c4d54532c7a`,
    elementType: `flashcard`,
    definition: `Et lyserødt dyr som spiser trøfler`,
    keywords: [`Gris`],
  },
  2.5: {
    iddocument: `0f734f32-6dda-11ea-9983-2c4d54532c7a`,
    elementType: `section`,
    content: `her er de første ti linier af en sektion`,
    keywords: [`SOTA`, `classkick`, `kahoot!`],
  },
  2.6: {
    iddocument: `2.6`,
    elementType: `section`,
    content: `her er de første ti linier af en sektion`,
    keywords: [`SOTA`, `classkick`, `kahoot!`],
  },
  2.7: {
    iddocument: `2.7`,
    elementType: `quiz`,
    question: `Hvilket dyr er en mester til at finde trøfler?`,
    answers: [`min radiator`, `en gris!`, `en ged`, `et evalueringsværktøj`],
    correctness: [0, 1, 0, 0],
    keywords: [`SOTA`, `classkick`, `kahoot!`],
  },
  2.8: {
    iddocument: `2.8`,
    elementType: `section`,
    content: `her er de første ti linier af en sektion`,
    keywords: [`SOTA`, `classkick`, `kahoot!`],
  },
  2.9: {
    iddocument: `2.9`,
    elementType: `section`,
    content: `her er de første ti linier af en sektion`,
    keywords: [`SOTA`, `classkick`, `kahoot!`],
  },
};


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

    // parse data from sqlpacket to OUR packet type
    mydata = await parseSql.parser(data);

    // make list of all sections availabel as html on page
    this.ejs = path.join(`${this.root}/www/views/rapport.ejs`);
    res.render(this.ejs, { Afsnit: mydata });
  }

  // viser én section
  async rapportSectionPage(req, res) {
    // get data from database
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
