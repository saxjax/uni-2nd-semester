/* eslint-disable guard-for-in */
/* eslint no-console: off */
const path = require(`path`);
const { Document } = require(`../Document/Document.js`);

const { User } = require(`../User/User.js`);

// Mock Data
let sectionDatabaseJakob = [
  {iddocument: "83f5173d-685a-11ea-9793-00ff63f710b8", elementType: "section",title: "titel 1", content: "her er de første ti linier af en sektion", keywords: [`vidensdeling`, `feed-up`, `feed-forward`] },
  {iddocument: "0f64f6b9-6dda-11ea-9983-2c4d54532c7a",  elementType: "section",title: "titel 1",content: "her er de første ti linier af en sektion",keywords: [`studier`, `evaluering`, `formativ`, `summativ`] },
  {iddocument: "0f69a258-6dda-11ea-9983-2c4d54532c7a",  elementType: "section",title: "titel 1",content: "her er de første ti linier af en sektion",keywords: [`metoder`, `active recall`, `spaced repetition`] },
  {iddocument: "0f6ed223-6dda-11ea-9983-2c4d54532c7a",  elementType: "flashcard",definition: "Et lyserødt dyr som spiser trøfler",keywords: [`Gris`] },
  {iddocument: "0f734f32-6dda-11ea-9983-2c4d54532c7a",  elementType: "section",title: "titel 1",content: "her er de første ti linier af en sektion",keywords: [`SOTA`, `classkick`, `kahoot!`] },
  {iddocument: "2.6",  elementType: "section",title: "titel 1",content: "her er de første ti linier af en sektion",keywords: [`SOTA`, `classkick`, `kahoot!`] },
  {iddocument: "2.7",  elementType: "quiz",question: "Hvilket dyr er en mester til at finde trøfler?",answers:["min radiator", "en gris!","en ged", "et evalueringsværktøj"],correctness:[0,1,0,0] ,keywords: [`SOTA`, `classkick`, `kahoot!`] },
  {iddocument: "2.8",  elementType: "section",title: "titel 1",content: "her er de første ti linier af en sektion",keywords: [`SOTA`, `classkick`, `kahoot!`] },
  {iddocument: "2.9",  elementType: "section",title: "titel 1",content: "her er de første ti linier af en sektion",keywords: [`SOTA`, `classkick`, `kahoot!`] },
];


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

let sections = [2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3];

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

    let mydata = sectionDatabaseJakob;

    const doc = new Document();
    const data = await doc.getAllSections();
    // console.log(data.length);
    mydata = parsesql(data);

    let Quizes = [];
    let Flashcards =[];

    for (const index in mydata) {
      if (mydata[index].elementType == `flashcard`){
        Flashcards.push(mydata[index]);
      }
      else if (mydata[index].elementType == `quiz`){
        Quizes.push(data[index]);
      }
    }
    let listFlashcards = createlist(Flashcards);
    let listQuizes = createlist(Quizes);
    this.ejs = path.join(`${this.root}/www/views/evalueringer1.ejs`);
    res.render(this.ejs, { listOfAllFlashcards: listFlashcards, listOfAllQuizes: listQuizes });
  }

  evalueringerTypePage(req, res) {
    if (req.params.type === `flashcard`) {
      this.ejs = path.join(`${this.root}/www/views/evalueringerFlashcard.ejs`);
      res.render(this.ejs, {section: req.params.afsnit});
    }
    else if (req.params.type === `quiz`) {
      this.ejs = path.join(`${this.root}/www/views/evalueringerQuiz.ejs`);
      res.render(this.ejs, {section: req.params.afsnit});
    }
  }

  // elementList(req, res) {
  //   this.ejs = path.join(`${this.root}/www/views/elementList.ejs`);
  //   res.render(this.ejs);
  // }

  async rapportPage(req, res) {
    //test data
    let mydata = sectionDatabaseJakob
    ////data hentes fra DB
    const doc = new Document();
    const data = await doc.getAllSections();
    console.log("rapportPage:");
    console.log(data);
    mydata = parsesql(data);
    mydata
    console.log(mydata);
    

    let list1 = createlist(mydata);
    this.ejs = path.join(`${this.root}/www/views/rapport.ejs`);
    res.render(this.ejs, { afsnit: sections, listOfAllReports: list1 });
  }

  async rapportSectionPage(req, res) {
    // console.log(req.params.iddocument);
    let doc = new Document();
    let data = await doc.getKeywordsForSection(req.params.iddocument);
    let myKeywords = [];
    for (const i in data){
      myKeywords.push(data[i].keyword);
    }

    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    res.render(this.ejs, { section: req.params.iddocument, keywords: myKeywords });
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

function parsesql(data){
  
 let mydata = [];
  for (let i=0 ; i<data.length; i++){
    // console.log(data[i].elementtype);
    mydata.push({
      elementtype : `${data[i].elementtype}`,
      iddocument : `${data[i].iddocument}`,
      title : `${data[i].title}`, 
      content: `${data[i].content}` 
      // keywords: [`vidensdeling`, `feed-up`, `feed-forward`] }
      
    })
    
  }
  return mydata;  
}

function createlist(elementList) {
  let HTML = `
    <div class="deck"><h1>A Deck of Cards</h1>
    <a href="javascript:void(0)" class="btn" onclick="shuffle()">Shuffle</a>
    <div id="deck">`;

  const HTMLEnd = `</div></div>`;
  // console.log("length:"+ elementList.length);
  console.log("create list:");
  console.log(elementList);


  // eslint-disable-next-line no-restricted-syntax
  for (let index=0 ; index<elementList.length; index++){
    let keywords = ``;

    switch (elementList[index].elementtype) {
      case `section`:
        HTML += `<a href="/rapport/${elementList[index].iddocument}" >`;
        HTML += `<div class="card">`;
        HTML += `<div class="elementType${elementList[index].elementtype}">${elementList[index].elementtype} ${elementList[index].title}</div>`
        HTML += `<div class="value">keywords:</div><div>`;
        console.log(elementList[index])

        // elementList[index].keywords.forEach((key) => {
        //   keywords += `<a>${key}  </a>`;
        // });
        HTML += `<div class="keywords">${keywords}</div></div>`;
        HTML += `<div class="contentSection">${elementList[index].content}</div>`;
        break;

      case `quiz`:
        HTML += `<a href="/evalueringer/quiz/${elementList[index].iddocument}" >`;
        HTML += `<div class="card">`;
        HTML += `<div class="elementType${elementList[index].elementtype}${elementList[index].iddocument}">${elementList[index].elementtype} ${elementList[index].iddocument}</div>`;
        HTML += `<div class="contentQuiz">${elementList[index].question}</div>`;
        HTML += `<a href="javascript:void(0)" class="btn" onclick="ShowFlashcardDefinition()"><p>Answer#1:${elementList[index].answers[0]}</p></a>`;
        HTML += `<a href="javascript:void(0)" class="btn" onclick="ShowFlashcardDefinition()"><p>Answer#2${elementList[index].answers[1]}</p></a>`;
        HTML += `<a href="javascript:void(0)" class="btn" onclick="ShowFlashcardDefinition()"><p>Answer#3${elementList[index].answers[2]}</p></a>`;
        HTML += `<a href="javascript:void(0)" class="btn" onclick="ShowFlashcardDefinition()"><p>Answer#4 ${elementList[index].answers[3]}</p></a>`;
        break;

      case `flashcard`:
        elementList[index].keywords.forEach((key) => {
          keywords += `<p>${key}</p>`;
        });
        // console.log(elementList[index].keywords)
        HTML += `<a href="/evalueringer/flashcard/${elementList[index].iddocument}" >`;
        HTML += `<div class="card">`;
        HTML += `<div class="elementType${elementList[index].elementtype}${elementList[index].iddocument}">${elementList[index].elementtype} ${elementList[index].iddocument}</div>`;
        HTML += `<div class="FlashcardBegreb">${keywords}</div>`;
        HTML += `<a href="javascript:void(0)" class="btn" onclick="ShowFlashcardDefinition()">Turn Card</a>`;
        HTML += `<div class="FlashcardDefinition">${elementList[index].definition}</div>`;
        // HTML += `<div class="contentFlashcard">${elementList[index].content}</div>`;
        break;

      default:  break;
    }
    HTML += `</div></a>`;
  }

  HTML += HTMLEnd;
  return HTML;
}
