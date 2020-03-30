/* eslint-disable guard-for-in */
/* eslint no-console: off */
const path = require(`path`);
const { Document } = require(`../Document/Document.js`);
const { Evaluation } = require(`../Evaluation/Evaluation.js`);
const { Keyword } = require(`../Document/Keyword.js`);

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


const sections = [2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3];

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
  //   // mock data
  //  let mydata = sectionDatabaseJakob;

    // get data from database
    const doc = new Evaluation();
    const data = await doc.getAllEvaluations();

    // parse data from sqlpacket to OUR packet type
    const mydata = await parsesql(data);

    // populate Quizzes and flashcards based on cardtype
    const Quizes = [];
    const Flashcards = [];
    for (const index in mydata) {
      if (mydata[index].elementtype == `flashcard`) {
        Flashcards.push(mydata[index]);
      }
      else if (mydata[index].elementtype == `quiz`) {
        Quizes.push(mydata[index]);
      }
    }

    // create HTML
    const listFlashcards = createlist(Flashcards);
    const listQuizes = createlist(Quizes);

    // make flashcardlist and quizlist availabel as html on page
    this.ejs = path.join(`${this.root}/www/views/evalueringer1.ejs`);
    res.render(this.ejs, { listOfAllFlashcards: listFlashcards, listOfAllQuizes: listQuizes });
  }


  evalueringerTypePage(req, res) {
    if (req.params.type === `flashcard`) {
      this.ejs = path.join(`${this.root}/www/views/evalueringerFlashcard.ejs`);
      res.render(this.ejs, { section: req.params.afsnit });
    }
    else if (req.params.type === `quiz`) {
      this.ejs = path.join(`${this.root}/www/views/evalueringerQuiz.ejs`);
      res.render(this.ejs, { section: req.params.afsnit });
    }
  }

  // viser alle oprettede sections
  async rapportPage(req, res) {
    // //test data
    // let mydata = sectionDatabaseJakob

    // AAAARGHH//data hentes fra DB
    const doc = new Document();
    let mydata = [];
    const data = await doc.getAllSections();
    // try {
    //   let data = await doc.getAllSections()
    //   .catch(() => {this.mydata = sectionDatabaseJakob})
    //   console.log(data);
    //   if(data != null){mydata = await parsesql(data);}
    // } catch (error) {
    //   console.log(`Lost connnection to DB mock data loaded`);
    //   // console.log(mydata);
    // }

    // console.log(mydata);

    // parse data from sqlpacket to OUR packet type
    mydata = await parsesql(data);

    // create HTML
    const listAllSections = createlist(mydata);

    // make list of all sections availabel as html on page
    this.ejs = path.join(`${this.root}/www/views/rapport.ejs`);
    res.render(this.ejs, { afsnit: sections, listOfAllReports: listAllSections });
  }

  // viser én section
  async rapportSectionPage(req, res) {
    // get data from database
    const doc = new Document();
    const section = await doc.getSection(req.params.iddocument);

    // parse data from sqlpacket to OUR packet type, defined in Document,Quiz, Flashcard
    const mySection = await parsesql(section);
    console.log(mySection);

    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    res.render(this.ejs, { section: mySection[0].title, keywords: mySection[0].keywords });
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

async function parsesql(data) {
  // const doc = new Document();
  const keyw = new Keyword();

  const mydata = [];
  let  keywords = [];
  for (let i = 0; i < data.length; i++) {
    // console.log(data[i].elementtype);
    switch (data[i].elementtype) {
      case `section`:
        keywords = await keyw.getKeywordsForSection(data[i].iddocument);
        keywords = parseKeywordsFromSql(keywords);
        mydata.push({
          elementtype: `${data[i].elementtype}`,
          iddocument: `${data[i].iddocument}`,
          title: `${data[i].title}`,
          content: `${data[i].content}`,
          keywords: `${keywords}`,
        });
        break;

      case `quiz`:
        keywords = await keyw.getKeywordsForEvaluation(data[i].idquiz);
        keywords = parseKeywordsFromSql(keywords);
        // .then((k) => parseKeywordsFromSql(k));
        // const quiz = new Quiz(
        //   this.elementtype = data[i].elementtype,
        //   this.idquiz = data[i].idquiz,
        //   this.iddocument = data[i].iddocuments,
        //   this.title = data[i].title,
        //   this.keywords = keywords,
        //   this.Question = data[i].question,
        //   this.Answer = [data[i].answer1, data[i].answer2, data[i].answer3, data[i].answer4],
        //   // correctness er en binær repræsentation af svarernes sandhadsværdi "0001" betyder at answers[3] i er korrekt de andre er false!
        //   this.correctness = data[i].correctness
        // );

        mydata.push({
          elementtype: `${data[i].elementtype}`,
          idquiz: `${data[i].idquiz}`,
          iddocuments: `${data[i].iddocument}`,
          title: `${data[i].title}`,
          question: `${data[i].question}`,
          answers: [`${data[i].answer1}`, `${data[i].answer2}`, `${data[i].answer3}`, `${data[i].answer4}`],
          correctness: `${data[i].correctness}`,
          keywords: `${keywords}`,
        });
        break;

      case `flashcard`:
        keywords = await keyw.getKeywordsForEvaluation(data[i].idflashcard);
        keywords = parseKeywordsFromSql(keywords);
        // mydata.push({
        // elementtype : `${data[i].elementtype}`,
        // iddocument : `${data[i].iddocument}`,
        // title : `${data[i].title}`,
        // entity: `${data[i].content}`,
        // definition: [`${data[i].answer1}`,`${data[i].answer2}`,`${data[i].answer3}`,`${data[i].answer4}`],
        // correctness: `${data[i].correctness}`
        // keywords: `${keywords}`,
        // })
        break;

      default:
        break;
    }
  }
  // console.log(`parsed`);
  // console.log(mydata);
  return mydata;
}

function parseKeywordsFromSql(keywords) {
  const myKeywords = [];
  for (let i = 0; i < keywords.length; i++) {
    myKeywords.push(keywords[i].keyword);
  }
  return myKeywords;
}

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
