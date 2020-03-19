const path = require(`path`);

const { Expert } = require(`../Expert/Expert.js`);

class ViewController {
  constructor(request) {
    this.name = `ViewController`;
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

  evalPage(req, res) {
    this.ejs = path.join(`${this.root}/www/ejs/evalueringer.ejs`);
    res.render(this.ejs);
  }

  rapPage(req, res) {
    this.ejs = path.join(`${this.root}/www/ejs/rapport.ejs`);
    res.render(this.ejs);
  }
}


module.exports = {
  ViewController,
};
