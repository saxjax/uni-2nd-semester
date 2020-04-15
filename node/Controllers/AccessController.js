/* eslint-disable guard-for-in */
/* eslint no-console: off */
const path = require(`path`);
const { User } = require(`../Models/User`);

/* UNDER CONSTRUCTION */

class AccessController {
  /* UNDER CONSTRUCTION */
  constructor() {
    this.name = `ViewController`;
    this.root = __dirname.slice(0, -(`node/Controllers`.length));
    this.ejs = ``;
  }

  /* UNDER CONSTRUCTION */
  /* INDTIL VIDERE KAN DER KUN TILGÅS 1 grupperum og 1 user som automatisk assignes! */
  accessPoint(req, res) {
    if (req.session.groupId) {
      res.redirect(`/home`);
    }
    else if (req.session.userId) {
      res.redirect(`/groups`);
    }
    else {
      res.redirect(`/login`);
    }
  }

  /* Formål: At gøre udvikling nemmere, så en genstart af serveren ikke kræver login og valg af gruppe hver gang */
  async skipAccess(req, res, testUserId, testGroupId) {
    req.session.username = `Test User`;
    req.session.loggedin = true;
    req.session.userId = testUserId;

    req.session.groupname = `Test Group`;
    req.session.groupId = testGroupId;
    res.redirect(`/home`);
  }

  /* UNDER CONSTRUCTION */
  async groupsPage(req, res) {
    const U = new User(req);
    U.table = `user_group`;
    const data = {
      group: await U.query(`SELECT *`, `${U.idColumnName} = "${U.queryId}"`),
    };
    this.ejs = path.join(`${this.root}/www/views/groups.ejs`);
    res.render(this.ejs, { data });
  }

  /* UNDER CONSTRUCTION */
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

  /* UNDER CONSTRUCTION */
  loginPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/login.ejs`);
    res.render(this.ejs);
  }
}

module.exports = {
  AccessController,
};
