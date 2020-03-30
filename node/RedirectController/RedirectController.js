const path = require(`path`);

const { User } = require(`../User/User.js`);
let session = require(`express-session`);

var sectionDatabase = {
  2.1:   {keywords: ['vidensdeling', 'feed-up', 'feed-forward'].toString()},
  2.2:   {keywords: ['studier', 'evaluering', 'formativ', 'summativ'].toString()},
  2.3:   {keywords: ['metoder', 'active recall', 'spaced repetition'].toString()},
  2.4:   {keywords: ['blabla', 'jepjepjep', 'superdupersuperduper'].toString()},
  2.5:   {keywords: ['SOTA', 'classkick', 'kahoot!'].toString()},
  2.6:   {keywords: ['SOTA', 'classkick', 'kahoot!'].toString()},
  3.1:   {keywords: ['SOTA', 'classkick', 'kahoot!'].toString()},
  3.2:   {keywords: ['SOTA', 'classkick', 'kahoot!'].toString()},
  3.3:   {keywords: ['SOTA', 'classkick', 'kahoot!'].toString()}
};


class RedirectController {
  constructor() {
    this.name = `RedirectController`;
    this.root = __dirname.slice(0, -(`node/${this.name}`.length));
  }

  add_new_section(newSection, newKeywords){
    sectionDatabase[newSection] = {};
    sectionDatabase[newSection]['keywords'] = newKeywords;
  }

  dbdown(req, res) {
    this.ejs = path.join(`${this.root}/www/ejs/database_down.ejs`);
    res.render(this.ejs);
  }

  async auth(req, res) {
    const currentUser = new User(req);
    this.data = await currentUser.loginValid();
    if (this.data.fatal) {
      res.redirect(`/dbdown`);
    }
    else if (this.data.length > 0) {
      req.session.loggedin = true;
      req.session.key = this.data[0].username;
      res.redirect(`/`);
    }
    else {
      res.redirect(`/register`);
    }
  }

  UploadRapport(req, res) {
    let new_keywords = [req.body.keyword_1, req.body.keyword_2, req.body.keyword_3].toString();
    let new_section = req.body.name_of_section;
    // sectionDatabase[new_section] = {};
    // sectionDatabase[new_section]['keywords'] = new_keywords;

    this.add_new_section(new_section, new_keywords);

    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    res.render(this.ejs, {section: req.body.name_of_section, content: sectionDatabase});
  }

  UploadEvalueringer(req, res) {
    console.log(req.body);
    this.ejs = path.join(`${this.root}/www/views/evalueringerUpload.ejs`);
    res.render(this.ejs);
  }
}

module.exports = {
  RedirectController,
};


