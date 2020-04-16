/* eslint-disable guard-for-in */
/* eslint no-console: off */
const path = require(`path`);
const { Document } = require(`../Models/Document`);
const { Section } = require(`../Models/Section`);
const { Quiz } = require(`../Models/Quiz`);
const { Flashcard } = require(`../Models/Flashcard`);
const { Group } = require(`../Models/Group`);
const { User } = require(`../Models/User`);

/* ViewController er den controller som præsentere alle de "views" som brugeren kan se i et grupperum.
 * ViewControllerens metoder vil dermed alle sammen hente og vise et ejs dokument, hvor der medsendes data.
 * ViewController vil dermed være den simpleste form, da der ikke bør være nogen form for logik, men alt andet logik bør
 * henvises til eksempelvis RedirectController (hvis der skal tjekkes for redirects) mv.
 */

class ViewController {
  constructor() {
    this.name = `ViewController`;
    this.root = __dirname.slice(0, -(`node/Controllers`.length));
    this.ejs = ``;
  }

  /* Formål: Et overblik til brugeren om programmet, samt hvilke muligheder brugeren har.
   * Input : Et request der har oprettet en userId og groupId.
   * Output: Startsiden af hjemmesiden, som skal give et overblik for User.
   */
  async homePage(req, res) {
    const U = new User(req);
    const data = {
      user: await U.getThis(),
      req,
    };
    this.ejs = path.join(`${this.root}/www/views/home.ejs`);
    res.render(this.ejs, { data });
  }

  // Formål: Et overblik over alle de tilgængelige evalueringsværktøjer som brugeren har adgang til.
  // Input : Et request der har oprettet en userId og groupId.
  // Output: Viser alle tilgængelige evalueringer for en bestemt Group.
  /* UNDER CONSTRUCTION */
  async evalueringerPage(req, res) {
    const group = new Group(req);
    const data = {
      flashcard: await group.getAllElementsOfType(`Flashcard`),
      quiz: await group.getAllElementsOfType(`Quiz`),
    };

    this.ejs = path.join(`${this.root}/www/views/evalueringer.ejs`);
    res.render(this.ejs, { data });
  }

  // Formål: Viser indholdet af enten et flashcard eller en quizz vha. siden evalueringerFlashcard.ejs eller
  //         evalueringerQuiz.ejs.
  // Input : Id og en type(flashcard eller quiz) (id'et er hhv idflashcard og idquiz alt efter typen)
  //         alt efter typen s� hentes quiz questions eller flashcards knyttet til det specifikke idflashcard eller idquiz.
  // Output: Array hvor index 0 indeholder flashcard_data eller quiz_question data, hvilket sendes til
  //         hhv /www/views/evalueringerFlashcard.ejs eller /www/views/evalueringerQuiz.ejs
  /* UNDER CONSTRUCTION */
  async quizPage(req, res) {
    const quiz = new Quiz(req);
    const data = await quiz.getQuiz();
    this.ejs = path.join(`${this.root}/www/views/evalueringerQuiz.ejs`);
    res.render(this.ejs, { quiz: data });
  }

  /* UNDER CONSTRUCTION */
  async flashcardPage(req, res) {
    const flashcard = new Flashcard(req);
    const data = await flashcard.getFlashcard();
    this.ejs = path.join(`${this.root}/www/views/evalueringerFlashcard.ejs`);
    res.render(this.ejs, { flashcard: data });
  }

  // Formål: Viser alle tilg�ngelige sections fra databasen p� siden rapport.ejs
  // input : Non
  // output: Array af Alle tilg�ngelige sections i databasen sendes som
  //         array: afsnit til /www/views/rapport.ejs
  /* UNDER CONSTRUCTION */
  async rapportPage(req, res) {
    const doc = new Document(req);
    // Her bliver der hardcoded et dokument som her antages at være "Rapporten"
    // Alle vores sections er tilknyttet 1 dokument hver, hvilket jeg antager er en fejl.
    // Vi kan måske også ønske os et sted hvor man får overblik over alle dokumenter?
    // Dette skal selvfølgelig autogenereres når en person vælger sit gruppe rum -> et dokument oprettes som "rapporten" etc.
    doc.idDocument = `'0f69a258-6dda-11ea-9983-2c4d54532c7a'`;
    const data = {
      section: await doc.getSections(),
    };
    this.ejs = path.join(`${this.root}/www/views/rapport.ejs`);
    res.render(this.ejs, { afsnit: data });
  }

  // Formål: Viser alle tilgængelige evaluations knyttet til en bestemt section på siden rapportafsnit.ejs
  // Input : Iddocument_section
  // Output: Array af Alle evalueringer samt content fra en section tilknyttet en section med id = iddocument_section
  //         sendes som arrays: flashcards, quizzes, section til /www/views/rapportafsnit.ejs
  /* UNDER CONSTRUCTION */
  async rapportSectionPage(req, res) {
    const sec = new Section(req);
    const data = {
      flashcards: await sec.getAllFlashcards(),
      quizzes: await sec.getAllQuizzes(),
      section: await sec.getThis(),
    };
    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    res.render(this.ejs, { data });
  }

  /* UNDER CONSTRUCTION */
  uploadPage(req, res) {
    if (req.params.type === `evalueringer`) {
      this.ejs = path.join(`${this.root}/www/views/evalueringerUpload.ejs`);
    }
    else if (req.params.type === `rapport`) {
      this.ejs = path.join(`${this.root}/www/views/rapportUpload.ejs`);
    }
    res.render(this.ejs);
  }

  /* UNDER CONSTRUCTION */
  createQuiz(req, res) {
    this.ejs = path.join(`${this.root}/www/views/createQuiz.ejs`);
    res.render(this.ejs);
  }

  /* UNDER CONSTRUCTION */
  createFlashcard(req, res) {
    const G = new Group(req);
    const data = {
      section: G.getAllElementsOfType(`section`),
    };
    this.ejs = path.join(`${this.root}/www/views/createFlashcard.ejs`);
    res.render(this.ejs, { data });
  }
}

module.exports = {
  ViewController,
};
