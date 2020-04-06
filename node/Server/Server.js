/* eslint no-console: off */

const express = require(`express`);
const upload = require(`express-fileupload`);
const session = require(`express-session`);
const bodyParser = require(`body-parser`);
const { ViewController } = require(`../ViewController/ViewController`);
const { RedirectController } = require(`../RedirectController/RedirectController`);
const pad = require(`./Pad`);


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
    this.app.get(`/`,                             (req, res) => Show.homePage(req, res));
    this.app.get(`/register`,                     (req, res) => Show.registerPage(req, res));
    this.app.get(`/login`,                        (req, res) => Show.loginPage(req, res));
    this.app.get(`/evalueringer`,                 (req, res) => Show.evalueringerPage(req, res));
    this.app.get(`/evalueringer/:type/:id`,           (req, res) => Show.evalueringerTypePage(req, res));
    // this.app.get(`/evalueringer/:type/:idquiz`,   (req, res) => Show.evalueringerTypePage(req, res));
    this.app.get(`/rapport`,                      (req, res) => Show.rapportPage(req, res));
    this.app.get(`/rapport/:iddocument_section`,  (req, res) => Show.rapportSectionPage(req, res));
    this.app.get(`/elementList`,                  (req, res) => Show.elementList(req, res));
    this.app.get(`/upload/:type`,                 (req, res) => Show.uploadPage(req, res));
  }

  redirectPatterns() {
    const Redirect = new RedirectController();
    this.app.get(`/dbdown`,                (req, res) => Redirect.dbdown(req, res));
    this.app.post(`/auth`,                 (req, res) => Redirect.auth(req, res));
    this.app.post(`/upload/rapport`,       (req, res) => Redirect.UploadRapport(req, res));
    this.app.post(`/upload/evalueringer`,  (req, res) => Redirect.UploadEvalueringer(req, res));
    this.app.post(`/register`,             (req, res) => Redirect.RegisterNewUser(req, res));
  }

  staticMiddleware() {
    this.app.use(express.static(`${this.root}/www`));
    this.app.use(this.logger);
  }

  bodyParserMiddleware() {
    this.app.use(upload());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(session({
      key: `user_sid`, secret: `SECRET_SALT_CODE_BY_MIKE123456789`, resave: false, saveUninitialized: false, cookie: { maxAge: 600000 },
    }));
  }

  logger(req, res, next) {
    const reqMethod = pad(req.method, -6, ` `);
    const reqUrl = pad(`${req.protocol}://${req.get(`host`)}${req.originalUrl}`, 76, ` `);
    const date = (new Date()).toUTCString();
    console.log(`GOT ${reqMethod}: ${reqUrl} -- ${date}`);
    next();
  }
}

module.exports = {
  Server,
};
