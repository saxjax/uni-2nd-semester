const path = require(`path`);

const { Expert } = require(`../Expert/Expert.js`);

class ViewController {
  constructor(request) {
    this.name = `Client`;
    this.dir = __dirname;
  }

  homePage(req, res) {
    this.html = path.join(`${this.dir}/home.html`);
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
}

module.exports = {
  ViewController,
};
