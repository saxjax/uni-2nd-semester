const express = require(`express`);
// const bodyParser = require(`body-parser`);

const { Client } = require(`../Client/Client.js`);

class Server {
  constructor() {
    this.name = `Server`;
    this.port = 3000;
    this.app = express();
  }

  startServer(startMsg) {
    this.staticMiddleware();
    this.urlPatterns();

    return this.app.listen(this.port, () => console.log(`${startMsg}`));
  }

  urlPatterns() {
    const Show = new Client();
    this.app.get(`/`, (req, res) => Show.homePage(req, res));
    this.app.get(`/about`, (req, res) => Show.aboutPage(req, res));
  }

  staticMiddleware() {
    this.app.use(express.static(`../../www/css`));
    this.app.use(express.static(`../../www/img`));
    this.app.use(express.static(`../../www/js`));
  }
}

module.exports = {
  Server,
};
