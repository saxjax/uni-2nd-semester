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

  /* Session Interaction URLs */

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

  /* No Session Requirement URLs */

  /* UNDER CONSTRUCTION */
  loginPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/login.ejs`);
    res.render(this.ejs);
  }

  // TODO: Mangler EJS fil
  /* Formål: En side der angiver information om hjemmesiden.
   *         Denne side skal være tilgængelig fra alle sider af hjemmesiden.
   * Input : Non.
   * Output: Visning af information om hjemmesiden, uden man behøver være User.
   * FIXME: Implementation af denne funktionalitet kræver højst sandsynligt en ændring i Servermetoden "noSessionNoAccess"
   *         da den blokere for alt adgang til hjemmesiden, hvis man ikke er logget ind og har valgt gruppe, hvor denne
   *         vil være en undtagelse. Implementer gerne så denne kan være "en af flere" undtagelser.
   */
  async aboutPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/about.ejs`);
    res.render(this.ejs);
  }
}

module.exports = {
  AccessController,
};
