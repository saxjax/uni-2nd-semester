/* eslint no-console: off */

const express = require(`express`);
const upload = require(`express-fileupload`);
const session = require(`express-session`);
const bodyParser = require(`body-parser`);

const { ViewController } = require(`./Controllers/ViewController`);
const { AccessController } = require(`./Controllers/AccessController`);
const { SessionController } = require(`./Controllers/SessionController`);
const { RedirectController } = require(`./Controllers/RedirectController`);
const { CreateController } = require(`./Controllers/CreateController`);
const { TestController } = require(`./Controllers/TestController`);
const pad = require(`./HelperFunctions/Pad`);

/* Server er et objekt der opretter webapplikationen.
 * Server fungere dermed som den primære indgangsvinkel til programmet, og alle dele af programmet kan udledes herfra.
 * Server konstrueres ud fra nogle definerede settings, så det er muligt at opstarte en server i forskellige tilstande.
 */
class Server {
  constructor(settings) {
    this.app = express();
    this.root = __dirname.slice(0, -(`node`.length));

    this.name = settings.name;
    this.port = settings.port;
    this.debug = settings.debug;
    this.skipAccess = settings.skipAccess;
    this.userId = settings.userId;
    this.groupId = settings.groupId;
  }

  /* Formål: Opstiller alt det middleware som skal aktiveres ved hvert enkelt request.
   *         Denne struktur gør at der er mere kontrol over rækkefølgen (såsom først static, url'er til sidst)
   * Input : Valgte settings fra constructoren.
   * Output: Opstartning af Server
   */
  startServer() {
    this.staticMiddleware();
    this.bodyParserMiddleware();
    this.sessionMiddleware();

    this.sessionPatterns();
    this.accessPatterns();
    this.viewPatterns();
    this.redirectPatterns();
    this.createPatterns();
    if (this.debug) {
      this.testPatterns();
    }

    return this.app.listen(this.port, () => console.log(`${this.name} startin up on ${this.port}`));
  }

  /* Formål: At opstille alle de funktioner som loader og viser de ejs filer
             der skal bruges for at tilgå et grupperum */
  accessPatterns() {
    const Access = new AccessController();
    if (this.skipAccess) {
      this.app.get(`/`,         (req, res) => Access.skipAccess(req, res, this.userId, this.groupId));
    }
    else {
      this.app.get(`/`,         (req, res) => Access.accessPoint(req, res));
      this.app.get(`/register`, (req, res) => Access.registerPage(req, res));
      this.app.get(`/login`,    (req, res) => Access.loginPage(req, res));
      this.app.get(`/groups`,   (req, res) => Access.groupsPage(req, res));
    }
  }

  /* Formål: At opstille alle de funktioner som opsætter, ændrer og stopper sessions */
  sessionPatterns() {
    const Session = new SessionController();
    this.app.post(`/auth/user`, (req, res) => Session.userSession(req, res));
    this.app.get(`/session/group/:queryId`, (req, res) => Session.groupSession(req, res));
  }

  /* Formål: At opstille alle de funkktioner som loader en ejs fil og viser en side i et grupperum */
  viewPatterns() {
    const Show = new ViewController();
    this.app.get(`/home`,                             (req, res) => Show.homePage(req, res));
    this.app.get(`/evalueringer`,                 (req, res) => Show.evalueringerPage(req, res));
    this.app.get(`/evalueringer/quiz/:queryId`,        (req, res) => Show.quizPage(req, res));
    this.app.get(`/evalueringer/flashcard/:queryId`,   (req, res) => Show.flashcardPage(req, res));
    // this.app.get(`/evalueringer/:type/:idquiz`,   (req, res) => Show.evalueringerTypePage(req, res));
    this.app.get(`/rapport`,                      (req, res) => Show.rapportPage(req, res));
    this.app.get(`/rapport/:idSection`,  (req, res) => Show.rapportSectionPage(req, res));
    this.app.get(`/elementList`,                  (req, res) => Show.elementList(req, res));
    this.app.get(`/upload/:type`,                 (req, res) => Show.uploadPage(req, res));
  }

  /* Formål: At redirecte brugeren hen til det korrekte sted, eller vise den korrekte fejlmeddelse */
  redirectPatterns() {
    const Redirect = new RedirectController();
    this.app.get(`/dbdown`,                (req, res) => Redirect.dbdown(req, res));
    this.app.post(`/upload/rapport`,       (req, res) => Redirect.UploadRapport(req, res));
    this.app.post(`/upload/evalueringer`,  (req, res) => Redirect.UploadEvalueringer(req, res));
    this.app.post(`/register`,             (req, res) => Redirect.RegisterNewUser(req, res));
  }

  /* Formål: Struktur for de URL Patterns der indsætter data i databasen.
   * Input : Et request med data der passer til den model der skal oprettes.
   * Output: Setup af muligheden for klienten at poste data til databasen.
   */
  createPatterns() {
    const Creator = new CreateController();
    this.app.post(`/post/group`, (req, res) => Creator.createGroup(req, res));
    this.app.post(`/post/user`, (req, res) => Creator.createUser(req, res));
  }

  /* Formål: En "catch all" for alle de tests der ønskes at blive lavet, så de ikke "clutter" de andre URL'er til.
             Alle test skal dog helst følge formattet "/test/IndsætHvadDuVilHer"
             Test URL's må meget gerne fjernes efter deres test er implementeret.
   * Input : Unikt for hver url, da dette er lavet for at teste
   * Output: Setup af muligheden for udviklere at teste ting før de implementeres.
   */
  testPatterns() {
    const Tester = new TestController();
    this.app.get(`/test`, (req, res) => Tester.test(req, res));
    this.app.get(`/test2`, (req, res) => Tester.test2(req, res));
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

  /* UNDER CONSTRUCTION */
  sessionMiddleware() {
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
