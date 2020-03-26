/* eslint no-console: off */
const path = require(`path`);
const { Document } = require(`../Document/Document.js`);

const { User } = require(`../User/User.js`);
//Mock Data
let sectionDatabaseJakob = {
  1:{id: "2.1", elementType: "section",content: "her er de første ti linier af en sektion", keywords: [`vidensdeling`, `feed-up`, `feed-forward`] },
  2:{id: "2.2",  elementType: "section",content: "her er de første ti linier af en sektion",keywords: [`studier`, `evaluering`, `formativ`, `summativ`] },
  3:{id: "2.3",  elementType: "section",content: "her er de første ti linier af en sektion",keywords: [`metoder`, `active recall`, `spaced repetition`] },
  4:{id: "2.4",  elementType: "flashcard",definition: "Et lyserødt dyr som spiser trøfler",keywords: [`Gris`] },
  5:{id: "2.5",  elementType: "section",content: "her er de første ti linier af en sektion",keywords: [`SOTA`, `classkick`, `kahoot!`] },
  6:{id: "2.6",  elementType: "section",content: "her er de første ti linier af en sektion",keywords: [`SOTA`, `classkick`, `kahoot!`] },
  7:{id: "2.7",  elementType: "quiz",question: "Hvilket dyr er en mester til at finde trøfler?",answers:["min radiator", "en gris!","en ged", "et evalueringsværktøj"],correctness:[0,1,0,0] ,keywords: [`SOTA`, `classkick`, `kahoot!`] },
  8:{id: "2.8",  elementType: "section",content: "her er de første ti linier af en sektion",keywords: [`SOTA`, `classkick`, `kahoot!`] },
  9:{id: "2.9",  elementType: "section",content: "her er de første ti linier af en sektion",keywords: [`SOTA`, `classkick`, `kahoot!`] },
};

// Mock data til test
// var sectionDatabaseJakob = {
//   2.1: { keywords: ['vidensdeling', 'feed-up', 'feed-forward'].toString() },
//   2.2: { keywords: ['studier', 'evaluering', 'formativ', 'summativ'].toString() },
//   2.3: { keywords: ['metoder', 'active recall', 'spaced repetition'].toString() },
//   2.4: { keywords: ['blabla', 'jepjepjep', 'superdupersuperduper'].toString() },
//   2.5: { keywords: ['SOTA', 'classkick', 'kahoot!'].toString() },
//   2.6: { keywords: ['SOTA', 'classkick', 'kahoot!'].toString() },
//   3.1: { keywords: ['SOTA', 'classkick', 'kahoot!'].toString() },
//   3.2: { keywords: ['SOTA', 'classkick', 'kahoot!'].toString() },
//   3.3: { keywords: ['SOTA', 'classkick', 'kahoot!'].toString() }
// };

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
    this.ejs = path.join(`${this.root}/www/views/login.ejs`);
    res.render(this.ejs);
  }

  async evalueringerPage(req, res) {
    // Mock data til test
    // var sectionDatabaseJakob = [
    //   { content: { section: 2.1, flashcard: `flashcard`, quiz: `quiz` } },
    //   { content: { section: 2.2, flashcard: `flashcard`, quiz: `quiz` } },
    //   { content: { section: 2.3, flashcard: `flashcard`, quiz: `quiz` } },
    //   { content: { section: 2.4, flashcard: `flashcard`, quiz: `quiz` } },
    // ];
        
    // const data = sectionDatabaseJakob;

    const doc = new Document();
    const data = await doc.getAllSections();

    let Quizes = [];
    let Flashcards =[];
    
    for (const section in data) {
      if (data[section].elementType == `flashcard`){
        Flashcards.push(data[section]);
      }
      else if (data[section].elementType == `quiz`){
        Quizes.push(data[section]);
      }
    }
    let listFlashcards = createlist(Flashcards);
    let listQuizes = createlist(Quizes);
    this.ejs = path.join(`${this.root}/www/views/evalueringer1.ejs`);
    res.render(this.ejs, { listOfAllFlashcards: listFlashcards , listOfAllQuizes: listQuizes });
  }

  evalueringerTypePage(req, res) {
    if (req.params.type === `flashcard`) {
      this.ejs = path.join(`${this.root}/www/views/evalueringerFlashcard.ejs`);
      res.render(this.ejs);
    }
    else if (req.params.type === `quiz`) {
      this.ejs = path.join(`${this.root}/www/views/evalueringerQuiz.ejs`);
      res.render(this.ejs);
    }
  }

  elementList(req, res) {
    this.ejs = path.join(`${this.root}/www/views/elementList.ejs`);
    res.render(this.ejs);
  }

  async rapportPage(req, res) {
    //test data
    const data = sectionDatabaseJakob
    ////data hentes fra DB
    // const doc = new Document();
    // const data = await doc.getAllSections();
    // console.log(data);
    
    for (let element in data) {
      console.log("Nyt data element "+data[element]);
    }

    let list1 = createlist(data);
    let sections = [];
    for (const section in data) {
      
        sections.push(data[section].id);
    }
    this.ejs = path.join(`${this.root}/www/views/rapport.ejs`);
    res.render(this.ejs, { afsnit: sections, listOfAllReports: list1 });
  }

  rapportSectionPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    res.render(this.ejs, { section: req.params.afsnit, content: sectionDatabaseJakob });
  }

  UploadPage(req, res) {
    if (req.params.type === `evalueringer`) {
      this.ejs = path.join(`${this.root}/www/views/evalueringerUpload.ejs`);
      res.render(this.ejs);
    }
    else if (req.params.type === `rapport`) {
      this.ejs = path.join(`${this.root}/www/views/rapportUpload.ejs`);
      res.render(this.ejs);
    }
  }

  RapportPost(req, res) {
    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    console.log(req.body.name);
    var sectionDatabaseJakob = {
      2.1: { keywords: [`vidensdeling`, `feed-up`, `feed-forward`].toString() },
      2.2: { keywords: [`studier`, `evaluering`, `formativ`, `summativ`].toString() },
      2.3: { keywords: [`metoder`, `active recall`, `spaced repetition`].toString() },
      2.4: { keywords: [`blabla`, `jepjepjep`, `superdupersuperduper`].toString() },
      2.5: { keywords: [`SOTA`, `classkick`, `kahoot!`].toString() },
      2.6: { keywords: [`SOTA`, `classkick`, `kahoot!`].toString() },
      3.1: { keywords: [`SOTA`, `classkick`, `kahoot!`].toString() },
      3.2: { keywords: [`SOTA`, `classkick`, `kahoot!`].toString() },
      3.3: { keywords: [`SOTA`, `classkick`, `kahoot!`].toString() },
    };
    res.render(this.ejs, { section: req.body.name, content: sectionDatabaseJakob });
  }

  EvalueringerPost(req, res) {
    this.ejs = path.join(`${this.root}/www/views/evalueringer.ejs`);
    res.render(this.ejs);
  }
}

module.exports = {
  ViewController,
};

function createlist(elementList) {
  
    HTML = `

    <div class="deck"><h1>A Deck of Cards</h1>
    <a href="javascript:void(0)" class="btn" onclick="shuffle()">Shuffle</a>
    <div id="deck">`;
    HTMLEnd = `</div></div>`;
    // console.log("length:"+ elementList.length);
    console.log(elementList);
    
    

    for (let element in elementList) {
      let keywords = ``
      
      

      switch (elementList[element].elementType) {
        case `section`:
          HTML += `<a href="/rapport/${elementList[element].id}" >`
          HTML += `<div class="card">`;
          HTML += `<div class="elementType${elementList[element].elementType}${elementList[element].id}">${elementList[element].elementType} ${elementList[element].id}</div>`
          HTML += `<div class="value">keywords:</div><div>`

          elementList[element].keywords.forEach(key => {
            keywords += `<a>${key}  </a>`
          });
          HTML += `<div class="keywords">${keywords}</div></div>`
          HTML += `<div class="contentSection">${elementList[element].content}</div>`;
          break;

        case `quiz`:
          HTML += `<a href="/evalueringer/quiz/${elementList[element].id}" >`
          HTML += `<div class="card">`;
          HTML += `<div class="elementType${elementList[element].elementType}${elementList[element].id}">${elementList[element].elementType} ${elementList[element].id}</div>`
          HTML += `<div class="contentQuiz">${elementList[element].question}</div>`;
          HTML += `<a href="javascript:void(0)" class="btn" onclick="ShowFlashcardDefinition()"><p>Answer#1:${elementList[element].answers[0]}</p></a>`
          HTML += `<a href="javascript:void(0)" class="btn" onclick="ShowFlashcardDefinition()"><p>Answer#2${elementList[element].answers[1]}</p></a>`
          HTML += `<a href="javascript:void(0)" class="btn" onclick="ShowFlashcardDefinition()"><p>Answer#3${elementList[element].answers[2]}</p></a>`
          HTML += `<a href="javascript:void(0)" class="btn" onclick="ShowFlashcardDefinition()"><p>Answer#4 ${elementList[element].answers[3]}</p></a>`
         
          break;

        case `flashcard`:
          
          elementList[element].keywords.forEach(key => {
            // console.log(key)
            keywords += `<p>${key}</p>`
          });
          //   console.log(elementList[element].keywords)
          HTML += `<a href="/evalueringer/flashcard/${elementList[element].id}" >`
          HTML += `<div class="card">`;
          HTML += `<div class="elementType${elementList[element].elementType}${elementList[element].id}">${elementList[element].elementType} ${elementList[element].id}</div>`
          HTML += `<div class="FlashcardBegreb">${keywords}</div>`
          HTML += `<a href="javascript:void(0)" class="btn" onclick="ShowFlashcardDefinition()">Turn Card</a>`
          HTML += `<div class="FlashcardDefinition">${elementList[element].definition}</div>`
          // HTML += `<div class="contentFlashcard">${elementList[element].content}</div>`;
          break;

        default:  break;
      }
      
      HTML += `</div></a>`
    }

    HTML += HTMLEnd ; 
    return HTML  
}
