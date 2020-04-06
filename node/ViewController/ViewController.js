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

  // viser alle tilg�ngelige evalueringer fra databasen p� siden evalueringer.ejs
  // input : non
  // output: Array af Alle tilg�ngelige evalueringer i databasen b�de quizzes og flashcards sendes som
  //         arrays :flashcards og quizzes til /www/views/evalueringer.ejs
  async evalueringerPage(req, res) {
    const evalu = new Evaluation();
    const parseSql = new ParseSql();

    evalu.table = `quiz`;
    const quizData = await evalu.getAllEvaluations();
    const parsedQuizData = await parseSql.parser(quizData);

    evalu.table = `flashcard`;
    const flashcardData = await evalu.getAllEvaluations();
    const parsedFlashcardData = await parseSql.parser(flashcardData);

    this.ejs = path.join(`${this.root}/www/views/evalueringer.ejs`);
    res.render(this.ejs, { flashcards: parsedFlashcardData, quizzes: parsedQuizData });
  }

  // viser indholdet af enten et flashcard eller en quizz vha. siden evalueringerFlashcard.ejs eller
  // evalueringerQuiz.ejs.
  // input: id og en type(flashcard eller quiz) (id'et er hhv idflashcard og idquiz alt efter typen)
  // alt efter typen s� hentes quiz questions eller flashcards knyttet til det specifikke idflashcard eller idquiz.
  // output: Array hvor index 0 indeholder flashcard_data eller quiz_question data, hvilket sendes til
  // hhv /www/views/evalueringerFlashcard.ejs eller /www/views/evalueringerQuiz.ejs
  async evalueringerTypePage(req, res) {
    console.log(req.params);
    const evalu = new Evaluation();
    const parseSql = new ParseSql();
    let data = [];
    let parsedData = [];

    if (req.params.type === `flashcard`) {
      const { id } = req.params;
      data = await evalu.getFlashcard(id);
      parsedData = await parseSql.parser(data);
      this.ejs = path.join(`${this.root}/www/views/evalueringerFlashcard.ejs`);
      res.render(this.ejs, { flashcard: parsedData });
    }
    else if (req.params.type === `quiz`) {
      const { id } = req.params;
      data = await evalu.getQuiz(id);
      parsedData = await parseSql.parser(data);

      this.ejs = path.join(`${this.root}/www/views/evalueringerQuiz.ejs`);
      res.render(this.ejs, { quiz: parsedData });
    }
  }

  // viser alle tilg�ngelige sections fra databasen p� siden rapport.ejs
  // input : non
  // output: Array af Alle tilg�ngelige sections i databasen sendes som
  //         array: afsnit til /www/views/rapport.ejs
  async rapportPage(req, res) {
    const sec = new Section();
    let mydata = [];
    const data = await sec.getAllSections();
    const parseSql = new ParseSql();

    mydata = await parseSql.parser(data);

    this.ejs = path.join(`${this.root}/www/views/rapport.ejs`);
    res.render(this.ejs, { afsnit: mydata });
  }

  // viser alle tilg�ngelige evaluations knyttet til en bestemt section p� siden rapportafsnit.ejs
  // input : iddocument_section
  // output: Array af Alle evalueringer samt content fra en section tilknyttet en section med id = iddocument_section
  // sendes som arrays: flashcards, quizzes, section til /www/views/rapportafsnit.ejs
  async rapportSectionPage(req, res) {
    const id = req.params.iddocument_section;
    const parseSql = new ParseSql();

    const section = new Section();
    const evaluering = new Evaluation();

    evaluering.table = `quiz`;
    const evaluations = await evaluering.getEvalForSection(id);
    const parsedEvaluations = await parseSql.parser(evaluations);
    console.log(parsedEvaluations);


    evaluering.table = `flashcard`;
    const flashcards = await evaluering.getEvalForSection(id);
    const parsedFlashcards = await parseSql.parser(flashcards);

    const currentSection = await section.getSection(id);
    const parsedSection = await parseSql.parser(currentSection);

    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    res.render(this.ejs, {  flashcards: parsedFlashcards,  quizzes: parsedEvaluations, section: parsedSection  });
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
