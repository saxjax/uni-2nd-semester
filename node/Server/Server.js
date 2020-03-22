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
    this.app.get(`/`,                   (req, res) => Show.homePage(req, res));
    this.app.get(`/register`,           (req, res) => Show.registerPage(req, res));
    this.app.get(`/login`,              (req, res) => Show.loginPage(req, res));
    this.app.get(`/evalueringer`,       (req, res) => Show.evalueringerPage(req, res));
    this.app.get(`/evalueringer/:type`, (req, res) => Show.evalueringerTypePage(req, res));
    this.app.get(`/rapport`,            (req, res) => Show.rapportPage(req, res));
    this.app.get(`/rapport/:afsnit`,    (req, res) => Show.rapportSectionPage(req, res));
    this.app.get(`/elementList`,        (req, res) => Show.elementList(req, res));
  }

  redirectPatterns() {
    const Redirect = new RedirectController();
    this.app.get(`/dbdown`, (req, res) => Redirect.dbdown(req, res));
    this.app.post(`/auth`,  (req, res) => Redirect.auth(req, res));
  }

  staticMiddleware() {
    this.app.use(`/js`,       express.static(`${this.root}/www/js`));
    this.app.use(`/css`,      express.static(`${this.root}/www/css`));
    this.app.use(`/img`,      express.static(`${this.root}/www/img`));
    this.app.use(`/icon.ico`, express.static(`${this.root}/www/img/icon.ico`));
  }

  bodyParserMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }
}

module.exports = {
  Server,
};
