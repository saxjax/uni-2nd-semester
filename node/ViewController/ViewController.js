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
    const evalu = new Evaluation();
    const parseSql = new ParseSql();

    evalu.table = `quiz`;
    const quizData = await evalu.getAllEvaluations();
    const parsedQuizData = await parseSql.parser(quizData);

    evalu.table = `flashcard`;
    const flashcardData = await evalu.getAllEvaluations();
    const parsedFlashcardData = await parseSql.parser(flashcardData);

    // make flashcards and quizzes availabel to HTML page
    this.ejs = path.join(`${this.root}/www/views/evalueringer.ejs`);
    res.render(this.ejs, { flashcards: parsedFlashcardData, quizzes: parsedQuizData });
  }

  /*
input: id og en type(flashcard eller quiz) (id'et er hhv idflashcard og idquiz alt efter typen)
alt efter typen så hentes quiz questions eller flashcards knyttet til det specifikke idflashcard eller idquiz.
output: Array hvor index 0 indeholder flashcard_data eller quiz_question data, hvilket sendes til
hhv /www/views/evalueringerFlashcard.ejs eller /www/views/evalueringerQuiz.ejs
*/
  async evalueringerTypePage(req, res) {
    console.log(req.params);
    const evaluations = new Evaluation();
    const parseSql = new ParseSql();
    let data = [];
    let parsedData = [];

    if (req.params.type === `flashcard`) {
      const { id } = req.params;
      data = await evaluations.getFlashcard(id);
      parsedData = await parseSql.parser(data);
      this.ejs = path.join(`${this.root}/www/views/evalueringerFlashcard.ejs`);
      res.render(this.ejs, { flashcard: parsedData });
    }
    else if (req.params.type === `quiz`) {
      const { id } = req.params;
      data = await evaluations.getQuiz(id);
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

  // viser Ã©n section
  async rapportSectionPage(req, res) {
    // get data from database
    const parseSql = new ParseSql();
    const id = req.params.iddocument_section;
    console.log(id);

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
    // const parsedSection = await parsesql(currentSection);

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
