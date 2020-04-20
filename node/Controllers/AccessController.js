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
    this.ejs = path.join(`${this.root}/www/views/register.ejs`);
    res.render(this.ejs);
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
