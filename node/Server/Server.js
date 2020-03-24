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
    this.app.get(`/`,                    (req, res) => Show.homePage(req, res));
    this.app.get(`/register`,            (req, res) => Show.registerPage(req, res));
    this.app.get(`/login`,               (req, res) => Show.loginPage(req, res));
    this.app.get(`/evalueringer`,        (req, res) => Show.evalueringerPage(req, res));
    this.app.get(`/evalueringer/:type`,  (req, res) => Show.evalueringerTypePage(req, res));
    this.app.get(`/rapport`,             (req, res) => Show.rapportPage(req, res));
    this.app.get(`/rapport/:afsnit`,     (req, res) => Show.rapportSectionPage(req, res));
    this.app.get(`/elementList`,         (req, res) => Show.elementList(req, res));
    this.app.get(`/upload/:type`,        (req, res) => Show.UploadPage(req, res));
    this.app.post(`/rapport/:afsnit`,    (req, res) => Show.RapportPost(req, res));
    this.app.post(`/evalueringer/:type`, (req, res) => Show.EvalueringerPost(req, res));
  }

  redirectPatterns() {
    const Redirect = new RedirectController();
    this.app.get(`/dbdown`, (req, res) => Redirect.dbdown(req, res));
    this.app.post(`/auth`,  (req, res) => Redirect.auth(req, res));
  }

  staticMiddleware() {
    this.app.use(express.static(`${this.root}/www`));
    this.app.use(this.logger);
  }

  bodyParserMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  logger(req, res, next) {
    console.log(`GOT ${req.method}: ${req.protocol}://${req.get(`host`)}${req.originalUrl} -- ${(new Date()).toUTCString()}`);
    next();
  }
}



module.exports = {
  Server,
};
