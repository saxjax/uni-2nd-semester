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

    evaluering.table = `quiz`;
    const evaluations = await evaluering.getEvalForSection(id);
    const parsedEvaluations = await parseSql.parser(evaluations);


    evaluering.table = `flashcard`;
    const flashcards = await evaluering.getEvalForSection(id);
    const parsedFlashcards = await parseSql.parser(flashcards);

    const currentSection = await section.getSection(id);
    const parsedSection = await parseSql.parser(currentSection);
    // const parsedSection = await parsesql(currentSection);

    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    res.render(this.ejs, {  flashcards: parsedFlashcards,  evaluations: parsedEvaluations, section: parsedSection  });
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
