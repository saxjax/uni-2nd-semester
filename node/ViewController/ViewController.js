const path = require(`path`);

const { Expert } = require(`../Expert/Expert.js`);

class ViewController {
  constructor(request) {
    this.name = `ViewController`;
    this.root = __dirname.slice(0, -(`node/ViewController`.length));
  }

  homePage(req, res) {
    console.log(this.root);
    this.html = path.join(`${this.root}/www/index.html`);
    res.sendFile(this.html);
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
}

module.exports = {
  ViewController,
};
