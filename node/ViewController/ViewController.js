/* eslint no-console: off */
const path = require(`path`);
const { Document } = require(`../Document/Document.js`);
const { User } = require(`../User/User.js`);

//Mock Data
let sectionDatabaseJakob = {
  2.1:{iddocument: "83f5173d-685a-11ea-9793-00ff63f710b8", elementType: "section",content: "her er de første ti linier af en sektion", keywords: [`vidensdeling`, `feed-up`, `feed-forward`] },
  2.2:{iddocument: "0f64f6b9-6dda-11ea-9983-2c4d54532c7a",  elementType: "section",content: "her er de første ti linier af en sektion",keywords: [`studier`, `evaluering`, `formativ`, `summativ`] },
  2.3:{iddocument: "0f69a258-6dda-11ea-9983-2c4d54532c7a",  elementType: "section",content: "her er de første ti linier af en sektion",keywords: [`metoder`, `active recall`, `spaced repetition`] },
  2.4:{iddocument: "0f6ed223-6dda-11ea-9983-2c4d54532c7a",  elementType: "flashcard",definition: "Et lyserødt dyr som spiser trøfler",keywords: [`Gris`] },
  2.5:{iddocument: "0f734f32-6dda-11ea-9983-2c4d54532c7a",  elementType: "section",content: "her er de første ti linier af en sektion",keywords: [`SOTA`, `classkick`, `kahoot!`] },
  2.6:{iddocument: "2.6",  elementType: "section",content: "her er de første ti linier af en sektion",keywords: [`SOTA`, `classkick`, `kahoot!`] },
  2.7:{iddocument: "2.7",  elementType: "quiz",question: "Hvilket dyr er en mester til at finde trøfler?",answers:["min radiator", "en gris!","en ged", "et evalueringsværktøj"],correctness:[0,1,0,0] ,keywords: [`SOTA`, `classkick`, `kahoot!`] },
  2.8:{iddocument: "2.8",  elementType: "section",content: "her er de første ti linier af en sektion",keywords: [`SOTA`, `classkick`, `kahoot!`] },
  2.9:{iddocument: "2.9",  elementType: "section",content: "her er de første ti linier af en sektion",keywords: [`SOTA`, `classkick`, `kahoot!`] },
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
    if (Registered.alreadyLoggedIn(req.session)) {
      console.log("i was already logged in, no need to register");
      res.redirect(`/`);
    }
    else {
      this.ejs = path.join(`${this.root}/www/views/register.ejs`);
      res.render(this.ejs);
    }
  }
  
  loginPage(req, res) {
    if(req.session.loggedin){
      this.ejs = path.join(`${this.root}/www/views/home.ejs`);
      console.log(`You are already logged in as ${req.session.key} `)
    }
    else{
      this.ejs = path.join(`${this.root}/www/views/login.ejs`);
    }
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
      res.render(this.ejs, {section: req.params.afsnit});
    }
    else if (req.params.type === `quiz`) {
      this.ejs = path.join(`${this.root}/www/views/evalueringerQuiz.ejs`);
      res.render(this.ejs, {section: req.params.afsnit});
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
  //   const doc = new Document();
  //   const data = await doc.getAllSections();
    

    
  //   let sections = [];
  //   for (const i in data) {
  //       sections.push(data[i].iddocument);
  //       console.log(data[i].iddocument)
  //       console.log(data[i].creator)
  //       console.log(data[i].title)
  //       console.log(data[i].elementtype)
  //       console.log(data[i].content)
    
  //   sectionDatabaseJakob += {i:{iddocument: data[i].iddocument, elementType: data[i].elementtype,content: data[i].content, keywords: [`vidensdeling`, `feed-up`, `feed-forward`] }}
  // }
  //   console.log(sectionDatabaseJakob);
    let list1 = createlist(data);
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


function createlist(elementList) {
  
    HTML = `

    <div class="deck"><h1>A Deck of Cards</h1>
    <a href="javascript:void(0)" class="btn" onclick="shuffle()">Shuffle</a>
    <div id="deck">`;
    HTMLEnd = `</div></div>`;
    // console.log("length:"+ elementList.length);
    //console.log(elementList);
    
    

    for (let element in elementList) {
      let keywords = ``
      
      

      switch (elementList[element].elementType) {
        case `section`:
          HTML += `<a href="/rapport/${elementList[element].iddocument}" >`
          HTML += `<div class="card">`;
          HTML += `<div class="elementType${elementList[element].elementType}${elementList[element].iddocument}">${elementList[element].elementType} ${elementList[element].iddocument}</div>`
          HTML += `<div class="value">keywords:</div><div>`

          elementList[element].keywords.forEach(key => {
            keywords += `<a>${key}  </a>`
          });
          HTML += `<div class="keywords">${keywords}</div></div>`
          HTML += `<div class="contentSection">${elementList[element].content}</div>`;
          break;

        case `quiz`:
          HTML += `<a href="/evalueringer/quiz/${elementList[element].iddocument}" >`
          HTML += `<div class="card">`;
          HTML += `<div class="elementType${elementList[element].elementType}${elementList[element].iddocument}">${elementList[element].elementType} ${elementList[element].iddocument}</div>`
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
          HTML += `<a href="/evalueringer/flashcard/${elementList[element].iddocument}" >`
          HTML += `<div class="card">`;
          HTML += `<div class="elementType${elementList[element].elementType}${elementList[element].iddocument}">${elementList[element].elementType} ${elementList[element].iddocument}</div>`
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
