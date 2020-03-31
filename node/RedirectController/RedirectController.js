/* eslint no-console: off */

const path = require(`path`);
const { User } = require(`../User/User.js`);

const sectionDatabase = {
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


class RedirectController {
  constructor() {
    this.name = `RedirectController`;
    this.root = __dirname.slice(0, -(`node/${this.name}`.length));
  }

  addNewSection(newSection, newKeywords) {
    sectionDatabase[newSection] = {};
    sectionDatabase[newSection].keywords = newKeywords;
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
      res.redirect(`/`);
    }
    else {
      res.redirect(`/register`);
    }
  }

  async RegisterNewUser(req, res) {
    const newUser = new User(req);
    // validate register here:
    if (newUser.validateRegister()) {
      console.log(`user is validated`);
      // Post newUser to database
      res.redirect(`/`);
    }
    else {
      console.log(`user is not validated`);
      // send error
      res.redirect(`/register`);
    }
    // console.log(`user is: ${newUser.username}`);
    // res.send(`hello`);
  }


  UploadRapport(req, res) {
    const newKeywords = [req.body.keyword_1, req.body.keyword_2, req.body.keyword_3].toString();
    console.log(req.body);
    const newSection = req.body.name_of_section;
    // sectionDatabase[newSection] = {};
    // sectionDatabase[newSection]['keywords'] = newKeywords;

    this.addNewSection(newSection, newKeywords);

    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    res.render(this.ejs, { section: req.body.name_of_section, content: sectionDatabase });
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
