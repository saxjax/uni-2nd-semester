/* eslint no-console: off */

const express = require(`express`);
const upload = require(`express-fileupload`);
const session = require(`express-session`);
const bodyParser = require(`body-parser`);
const { ViewController } = require(`../ViewController/ViewController`);
const { RedirectController } = require(`../RedirectController/RedirectController`);
const pad = require(`./Pad`);

/* Server er et objekt der opretter webapplikationen, og håndtere dermed socket/TCP laget af webprogrammet.
 * Server fungere dermed som den primære indgangsvinkel til programmet, og alle dele af programmet kan udledes herfra.
 */
class Server {
  /* Formål: At kunne give definere programmæsige settings et sted, så det er muligt
   *         at opstarte en server i forskellige tilstande.
   * Input: Settings som er defineret i main.js.
   * Output: En server der er oprettet på sin angivne port.
   */
  constructor(settings) {
    this.app = express();
    this.root = __dirname.slice(0, -(`node/Server`.length));

    this.name = settings.name;
    this.port = settings.port;
    this.debug = settings.debug;
  }

  /* Formål: Opstiller alt det middleware som skal aktiveres ved hvert enkelt request.
   *         Denne struktur gør at der er mere kontrol over rækkefølgen (såsom først static, url'er til sidst)
   * Input : Valgte settings fra constructoren.
   * Output: Opstartning af Server
   */
  startServer() {
    this.staticMiddleware();
    this.bodyParserMiddleware();

    this.urlPatterns();
    this.redirectPatterns();

    return this.app.listen(this.port, () => console.log(`${this.name} startin up on ${this.port}`));
  }

  /* UNDER CONSTRUCTION */
  urlPatterns() {
    const Show = new ViewController();
    this.app.get(`/`,                             (req, res) => Show.homePage(req, res));
    this.app.get(`/register`,                     (req, res) => Show.registerPage(req, res));
    this.app.get(`/login`,                        (req, res) => Show.loginPage(req, res));
    this.app.get(`/evalueringer`,                 (req, res) => Show.evalueringerPage(req, res));
    this.app.get(`/evalueringer/quiz/:idQuiz`,        (req, res) => Show.quizPage(req, res));
    this.app.get(`/evalueringer/flashcard/:idFlashcard`,   (req, res) => Show.flashcardPage(req, res));
    // this.app.get(`/evalueringer/:type/:idquiz`,   (req, res) => Show.evalueringerTypePage(req, res));
    this.app.get(`/rapport`,                      (req, res) => Show.rapportPage(req, res));
    this.app.get(`/rapport/:idSection`,  (req, res) => Show.rapportSectionPage(req, res));
    this.app.get(`/elementList`,                  (req, res) => Show.elementList(req, res));
    this.app.get(`/upload/:type`,                 (req, res) => Show.uploadPage(req, res));
    this.app.get(`/head`, (req, res) => Show.head(req, res));
  }

  /* UNDER CONSTRUCTION */
  redirectPatterns() {
    const Redirect = new RedirectController();
    this.app.get(`/dbdown`,                (req, res) => Redirect.dbdown(req, res));
    this.app.post(`/auth`,                 (req, res) => Redirect.auth(req, res));
    this.app.post(`/upload/rapport`,       (req, res) => Redirect.UploadRapport(req, res));
    this.app.post(`/upload/evalueringer`,  (req, res) => Redirect.UploadEvalueringer(req, res));
    this.app.post(`/register`,             (req, res) => Redirect.RegisterNewUser(req, res));
  }

  /* UNDER CONSTRUCTION */
  staticMiddleware() {
    this.app.use(express.static(`${this.root}/www/`));
    this.app.use(this.logger);
  }

  /* UNDER CONSTRUCTION */
  bodyParserMiddleware() {
    this.app.use(upload());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  sessionAndCookieMiddleware() {
    this.app.use(session({
      key: `user_sid`,
      secret: `SECRET_SALT_CODE_BY_MIKE123456789`,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 600000 },
    }));
  }

  /* UNDER CONSTRUCTION */
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
