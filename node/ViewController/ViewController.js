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

  registerPage(req, res) {
    const Registered = new User(req);
    if (Registered.alreadyLoggedIn()) {
      res.redirect(`/`);
    }
    else {
      this.ejs = path.join(`${this.root}/www/ejs/register.ejs`);
      res.render(this.ejs);
    }
  }

  loginPage(req, res) {
    this.ejs = path.join(`${this.root}/www/ejs/login.ejs`);
    res.render(this.ejs);
  }

  rapportPage(req, res) {
    this.ejs = path.join(`${this.root}/www/views/rapport.ejs`);
    res.render(this.ejs);
  }
}


module.exports = {
  ViewController,
};
