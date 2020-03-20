/* eslint no-console: off */
const express = require(`express`);
const bodyParser = require(`body-parser`);

const { ViewController } = require(`../ViewController/ViewController.js`);
const { RedirectController } = require(`../RedirectController/RedirectController.js`);

class Server {
  constructor() {
    this.name = `Server`;
    this.port = 3000;
    this.app = express();
    this.root = __dirname.slice(0, -(`node/${this.name}`.length));
  }

  startServer(startMsg) {
    this.staticMiddleware();
    this.bodyParserMiddleware();

    this.urlPatterns();
    this.redirectPatterns();

    return this.app.listen(this.port, () => console.log(`${startMsg}`));
  }

  urlPatterns() {
    const Show = new ViewController();
    this.app.get(`/template`, (req, res) => Show.template(req, res));
    this.app.get(`/`, (req, res) => Show.homePage(req, res));
    this.app.get(`/about`, (req, res) => Show.aboutPage(req, res));
    this.app.get(`/form/`, (req, res) => Show.businessLogicPage(req, res));
    this.app.get(`/1234`, (req, res) => Show.testPage(req, res));
    this.app.get(`/register`, (req, res) => Show.registerPage(req, res));
    this.app.get(`/login`, (req, res) => Show.loginPage(req, res));
  }

  redirectPatterns() {
    const Redirect = new RedirectController();
    this.app.get(`/dbdown`, (req, res) => Redirect.databaseDown(req, res));
    this.app.post(`/auth`, (req, res) => Redirect.authentication(req, res));
  }

  staticMiddleware() {
    this.app.use(`/css`, express.static(`${this.root}/www/css`));
  }

  bodyParserMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }
}


module.exports = {
  Server,
};
