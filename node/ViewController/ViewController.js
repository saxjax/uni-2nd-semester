/* eslint no-console: off */
const path = require(`path`);

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
    this.ejs = path.join(`${this.root}/www/views/login.ejs`);
    res.render(this.ejs);
  }

  evalueringerPage(req, res) {
    // Mock data til test
    let sectionDatabase = [ 
      {content:  {section: 2.1, flashcard: 'Flashcard', quiz: 'Quiz'}},
      {content:  {section: 2.2, flashcard: 'Flashcard', quiz: 'Quiz'}},
      {content:  {section: 2.3, flashcard: 'Flashcard', quiz: 'Quiz'}},
      {content:  {section: 2.4, flashcard: 'Flashcard', quiz: 'Quiz'}}
    ];
    this.ejs = path.join(`${this.root}/www/views/evalueringer.ejs`);
    res.render(this.ejs, {evalueringerContent: sectionDatabase});
  }

  evalueringerTypePage(req, res) {
    if (req.params.type === `flashcard`){
      this.ejs = path.join(`${this.root}/www/views/evalueringerFlashcard.ejs`);
      res.render(this.ejs);
    } else if (req.params.type === `quiz`){
      this.ejs = path.join(`${this.root}/www/views/evalueringerQuiz.ejs`);
      res.render(this.ejs);
    }
  }

  elementList(req, res) {
    this.ejs = path.join(`${this.root}/www/views/elementList.ejs`);ª
    res.render(this.ejs);
  }

  rapportPage(req, res) {
    // Mock data til test
    let sectionDatabase = [2.1,2.2,2.3,2.4,2.5,2.6,3.1,3.2,3.3];
    this.ejs = path.join(`${this.root}/www/views/rapport.ejs`);
    res.render(this.ejs, {afsnit: sectionDatabase});
  }

  rapportSectionPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    // Mock data til test
    let sectionDatabase = {
      2.1:   {keywords: ['vidensdeling', 'feed-up', 'feed-forward'].toString()},
      2.2:   {keywords: ['studier', 'evaluering', 'formativ', 'summativ'].toString()},
      2.3:   {keywords: ['metoder', 'active recall', 'spaced repetition'].toString()},
      2.4:   {keywords: ['SOTA', 'classkick', 'kahoot!'].toString()}
    };

    res.render(this.ejs, {section: req.params.afsnit, content: sectionDatabase});
  }
}


module.exports = {
  ViewController,
};
