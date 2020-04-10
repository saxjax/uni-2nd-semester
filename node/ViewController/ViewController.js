/* eslint-disable guard-for-in */
/* eslint no-console: off */
const path = require(`path`);
const { Document } = require(`../Document/Document`);
const { Section } = require(`../Section/Section`);
const { Quiz } = require(`../Evaluation/Quiz`);
const { Flashcard } = require(`../Evaluation/Flashcard`);
const { Group } = require(`../Group/Group`);
const { User } = require(`../User/User`);

/* FIXME: UNDER CONSTRUCTION */

class ViewController {
  /* FIXME: UNDER CONSTRUCTION */
  constructor() {
    this.name = `ViewController`;
    this.root = __dirname.slice(0, -(`node/${this.name}`.length));
    this.ejs = ``;
  }

  /* Dette er lavet for at kunne teste meta data fra SQL databasen */
  async head(req, res) {
    const object = new Document(req);
    console.log(object);
    console.log(await object.query(`SELECT iddocument`));
    res.send(`It worked`);
  }

  /* FIXME: UNDER CONSTRUCTION */
  homePage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/home.ejs`);
    res.render(this.ejs);
  }

  /* FIXME: UNDER CONSTRUCTION */
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

  /* FIXME: UNDER CONSTRUCTION */
  loginPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/login.ejs`);
    res.render(this.ejs);
  }

  // Formål: Viser alle tilg�ngelige evalueringer i gruppen p� siden evalueringer.ejs
  // Input : Non
  // Output: Array af Alle tilg�ngelige evalueringer i databasen b�de quizzes og flashcards sendes som
  //         arrays :flashcards og quizzes til /www/views/evalueringer.ejs
  /* FIXME: UNDER CONSTRUCTION */
  async evalueringerPage(req, res) {
    const group = new Group(req);
    const data = {
      flashcards: await group.getAllFlashcards(),
      quizzes: await group.getAllQuizzes(),
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
  /* FIXME: UNDER CONSTRUCTION */
  async quizPage(req, res) {
    const quiz = new Quiz(req);
    const data = await quiz.getQuiz();
    this.ejs = path.join(`${this.root}/www/views/evalueringerQuiz.ejs`);
    res.render(this.ejs, { quiz: data });
  }

  /* FIXME: UNDER CONSTRUCTION */
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
  /* FIXME: UNDER CONSTRUCTION */
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
  /* FIXME: UNDER CONSTRUCTION */
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

  /* FIXME: UNDER CONSTRUCTION */
  uploadPage(req, res) {
    if (req.params.type === `evalueringer`) {
      this.ejs = path.join(`${this.root}/www/views/evalueringerUpload.ejs`);
    }
    else if (req.params.type === `rapport`) {
      this.ejs = path.join(`${this.root}/www/views/rapportUpload.ejs`);
    }
    res.render(this.ejs);
  }
}

module.exports = {
  ViewController,
};
