const { Server } = require(`../Server/Server.js`);

class Client {
  constructor() {
    this.name = `Client`;
    this.html = ``;
  }

  homePage(req, res) {
    this.html = `<a href="/about">Click here!</a>`;
    res.send(`Welcome to home with ${this.html}`);
  }

  aboutPage(req, res) {
    this.html = `This OTHER Post <a href="/form">Go to form</a>`;
    res.send(`Reading about with ${this.html}`);
  }
}

module.exports = {
  Client,
};
