/* eslint no-console: off */
const path = require(`path`);

const { Expert } = require(`../Expert/Expert.js`);
const { User } = require(`../User/User.js`);

class ViewController {
  constructor(req) {
    this.name = `ViewController`;
    this.validated = false;
    this.root = __dirname.slice(0, -(`node/ViewController`.length));
  }


  template(req, res) {
    this.ejs = path.join(`${this.root}/www/ejs/template.ejs`);
    res.render(this.ejs);
  }

  homePage(req, res) {
    this.ejs = path.join(`${this.root}/www/ejs/home.ejs`);
    res.render(this.ejs);
  }

  aboutPage(req, res) {
    this.html = `This OTHER Post <a href="/form">Go to form</a>`;
    res.send(`Reading about with ${this.html}`);
  }

  businessLogicPage(req, res) {
    const Master = new Expert(req);
    this.html = `<p>På denne side vil du gerne vide et tilfældigt navn som er ${Master.firstname}</p>`;
    res.send(this.html);
  }

  testPage(req, res) {
    this.html = `Jeg er frustreret`;
    res.send(`Hello World`);
  }

  registerPage(req, res) {
    this.ejs = path.join(`${this.root}/www/ejs/register_form.ejs`);
    res.render(this.ejs);
  }

  loginPage(req, res) {
    this.ejs = path.join(`${this.root}/www/ejs/login.ejs`);
    res.render(this.ejs);
  }

  async authenticationPage(req, res) {
    const currentUser = new User(req);
    try {
      this.validated = await currentUser.loginValid();
      console.log(this.validated);
      if (this.validated) {
        res.redirect(`/`);
      }
      else {
        res.send(`Wrong username or password`);
      }
    }
    catch (error) {
      res.send(error);
    }
  }
}


module.exports = {
  ViewController,
};
