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
  }

  /* Formål: Opstiller alt det middleware som skal aktiveres ved hvert enkelt request.
   *         Denne struktur gør at der er mere kontrol over rækkefølgen (såsom først static, url'er til sidst, etc.)
   * Input : Valgte settings fra constructoren.
   * Output: Opstartning af Server
   */
  startServer() {
    this.staticMiddleware();
    this.bodyParserMiddleware();
    this.sessionMiddleware();
    this.viewEngineMiddleware();
    if (this.debug) {
      this.testMiddleware();
    }

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
             der skal bruges for at tilgå et grupperum
   * Input : Non. Her laves blot opsætningen.
   * Output: Opsætning af url'er som kan tilgås via serverens port.
   */
  accessPatterns() {
    const Access = new AccessController();
    this.app.get(`/register`, (req, res) => Access.registerPage(req, res));
    this.app.get(`/login`,    (req, res) => Access.loginPage(req, res));
    this.app.get(`/groups`,   (req, res) => Access.groupsPage(req, res));
  }

  /* Formål: At opstille alle de funktioner som opsætter, ændrer og stopper sessions
   *         Den første parameter angiver hvilken type session der er tale om.
   *         /auth omhandler et authentifikation af nogle indsendte data med et post request,
   *               og oprettelse af session hvis authentikationen er true.
   *         /session omhandler en oprettelse af en session ud fra et valgt objekt.
   * Input : Non. Her laves blot opsætningen.
   * Output: Opsætning af url'er som kan tilgås via serverens port.
   */
  sessionPatterns() {
    const Session = new SessionController();
    this.app.post(`/auth/user`, (req, res) => Session.userSession(req, res));
    this.app.get(`/session/group/:queryId`, (req, res) => Session.groupSession(req, res));
  }

  /* Formål: At opstille alle de funktioner som loader en ejs fil og viser en side i et grupperum
   *         Den første parameter angiver hvilken type view det er:
   *         Dem herunder knytter sig til et objekt. Alle andre (såsom /about) er selvstændige, hardcodede EJS filer.
   *           /view angiver at det er en side der kun skal ses,
   *           /create angiver at der vises en form som opretter objektet
   *           /delete angiver at der vises en form, som sletter objektet
   *           /update angiver at der vises en form, hvor man kan ændrer objektet
   *           "/" er lidt speciel da den tæller for startsiden.
   *         Alle objekter vil have et medfølgende queryId eller et /user eller /group,
   *           da det indikere hvad man får vist. (queryId for et bestemt objet,
   *           /user el. /group for alle objekter tilknyttet user/group).
   *         Andre /IndsætNoget (istedet for /queryId, /group eller /user) indikere at objektet håndteres anderledes
   *           end blot en "ren REST" database håndtering (som er: visning af en, visning af mange, oprettelse, sletning eller opdatering)
   *  Input : Non. Her laves blot opsætningen.
   * Output: Opsætning af url'er som kan tilgås via serverens port.
   * TODO: de kommenterede (//) er ikke implementeret endnu.
   */
  viewPatterns() {
    const Show = new ViewController();
    this.app.get(`/`,                             (req, res) => Show.homePage(req, res));
    // this.app.get(`/about`),                    (req, res) => Show.aboutPage(req, res));

    // Documents
    // this.app.get(`/view/document/group`,                 (req, res) => Show.viewDocumentGroupPage(req, res));
    // this.app.get(`/view/document/user`, (req, res) => Show.viewDocumentUserPage(req, res));
    // this.app.get(`/insert/document`, (req, res) => Show.insertDocumentPage(req, res));
    // this.app.get(`/view/document/:queryId`,        (req, res) => Show.viewDocumentPage(req, res));
    // this.app.get(`/delete/document/:queryId`, (req, res) => Show.deleteDocumentPage(req, res));
    // this.app.get(`/update/document/:queryId`, (req, res) => Show.updateDocumentPage(req, res));

    // Sections
    // this.app.get(`/view/section/group`,                 (req, res) => Show.viewSectionGroupPage(req, res));
    // this.app.get(`/view/section/user`, (req, res) => Show.viewSectionUserPage(req, res));
    // this.app.get(`/insert/section`, (req, res) => Show.insertSectionPage(req, res));
    // this.app.get(`/view/section/:queryId`,        (req, res) => Show.viewSectionPage(req, res));
    // this.app.get(`/delete/section/:queryId`, (req, res) => Show.deleteSectionPage(req, res));
    // this.app.get(`/update/section/:queryId`, (req, res) => Show.updateSectionPage(req, res));

    // Evaluations
    // this.app.get(`/view/evaluation/group`,                 (req, res) => Show.viewEvaluationGroupPage(req, res));
    // this.app.get(`/view/evaluation/user`, (req, res) => Show.viewEvaluationUserPage(req, res));
    // this.app.get(`/insert/evaluation`, (req, res) => Show.insertEvaluationPage(req, res));
    // this.app.get(`/view/evaluation/:queryId`,        (req, res) => Show.viewEvaluationPage(req, res));
    // this.app.get(`/delete/evaluation/:queryId`, (req, res) => Show.deleteEvaluationPage(req, res));
    // this.app.get(`/update/evaluation/:queryId`, (req, res) => Show.updateEvaluationPage(req, res));

    // Quiz
    // this.app.get(`/view/quiz/group`,                 (req, res) => Show.viewQuizGroupPage(req, res));
    // this.app.get(`/view/quiz/user`, (req, res) => Show.viewQuizUserPage(req, res));
    // this.app.get(`/insert/quiz`, (req, res) => Show.insertQuizPage(req, res));
    // this.app.get(`/view/quiz/:queryId`,        (req, res) => Show.viewQuizPage(req, res));
    // this.app.get(`/delete/quiz/:queryId`, (req, res) => Show.deleteQuizPage(req, res));
    // this.app.get(`/update/quiz/:queryId`, (req, res) => Show.updateQuizPage(req, res));

    // Flashcard
    // this.app.get(`/view/flashcard/group`, (req, res) => Show.viewFlashcardGroupPage(req, res));
    // this.app.get(`/view/flashcard/user`, (req, res) => Show.viewFlashcardUserPage(req, res));
    // this.app.get(`/insert/flashcard`, (req, res) => Show.insertFlashcardPage(req, res));
    // this.app.get(`/view/flashcard/:queryId`,        (req, res) => Show.viewFlashcardPage(req, res));
    // this.app.get(`/delete/flashcard/:queryId`, (req, res) => Show.deleteFlashcardPage(req, res));
    // this.app.get(`/update/flashcard/:queryId`, (req, res) => Show.updateFlashcardPage(req, res));
  }

  /* Formål: At redirecte brugeren hen til det korrekte sted, eller vise den korrekte fejlmeddelse.
   *         Denne controller vil IKKE håndtere nogle ejs filer overhovedet!
   *
   * Input : Non. Her laves blot opsætningen.
   * Output: Opsætning af url'er som kan tilgås via serverens port.
   */
  redirectPatterns() {
    const Redirect = new RedirectController();
    this.app.get(`/dbdown`,                (req, res) => Redirect.dbdown(req, res));
    this.app.post(`/upload/rapport`,       (req, res) => Redirect.UploadRapport(req, res));
    this.app.post(`/upload/evalueringer`,  (req, res) => Redirect.UploadEvalueringer(req, res));
    this.app.post(`/register`,             (req, res) => Redirect.RegisterNewUser(req, res));
    this.app.post(`/create/section`,       (req, res) => Redirect.createSection(req, res));
  }

  /* Formål: Struktur for de URL Patterns der indsætter data i databasen.
  *          Vil være den controller der håndtere posting af database, og dermed også sikkerhed.
   * Input : Et request med data der passer til den model der skal oprettes.
   * Output: Setup af muligheden for klienten at poste data til databasen.
   */
  createPatterns() {
    const Creator = new CreateController();
    this.app.post(`/post/group`, (req, res) => Creator.createGroup(req, res));
    this.app.post(`/post/user`, (req, res) => Creator.createUser(req, res));
    this.app.post(`/post/quiz`, (req, res) => Creator.createQuiz(req, res));
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
    this.app.get(`/test3`, (req, res) => Tester.test3(req, res));
    this.app.get(`/test3/:queryId`, (req, res) => Tester.test3(req, res));
  }

  /* Formål: Opsætning af en viewEngine så det er muligt at render ejs filer.
   * Input : En request for en ejs fil
   * Output: Muligheden for at sende ejs filer i et format så clienten kan render det.
   */
  viewEngineMiddleware() {
    this.app.set(`view engine`, `ejs`);
  }

  /* Formål: At gøre alle vores statiske filer tilgængelige for et request fra en client
   * Input : Et request der forespørger en statisk fil
   * Output: En static file der skal bruges i en ejs fil.
   */
  staticMiddleware() {
    this.app.use(express.static(`${this.root}/www/`));
  }

  /* Formål: At opstille body-parser så det bliver muligt nemmere at håndtere request objektet, såsom req.body og req.params
   * Input : Et request objekt
   * Output: Et modificeret request objekt, der følger body-parsers syntaks.
   */
  bodyParserMiddleware() {
    this.app.use(upload());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  /* Formål: At opstille den session som gør at programmet kan "huske" hvilken gruppe man er en del af samt hvilken bruger man er
   * Input : Non
   * Output: Muligheden for at tilgå req.session, samt et autogeneret login hvis man har sat skipAccess i settings til true.
   */
  sessionMiddleware() {
    this.app.use(session({
      key: `user_sid`,
      secret: `SECRET_SALT_CODE_BY_MIKE123456789`,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 600000 },
    }));
    if (this.skipAccess) {
      this.app.use(this.createTestUserAndGroupId);
    }
    this.app.use(this.noSessionNoAccess);
  }

  /* Formål: At skabe et user og group Id i tilfælde af at man i udviklingsmode ønsker at skippe login/gruppevalgs fasen.
   * Input : Et request
   * Output: En fuldt oprettet session for user og group data.
   */
  createTestUserAndGroupId(req, res, next) {
    if (!req.session.userId || !req.session.groupId) {
      req.session.username = `Test User`;
      req.session.loggedin = true;
      req.session.userId = `553e422d-7c29-11ea-86e2-2c4d54532c7a`;

      req.session.groupname = `Test Group`;
      req.session.groupId = `34701dd1-7c29-11ea-86e2-2c4d54532c7a`;
    }
    next();
  }

  /* Formål: At sikre sig at man ikke kan tilgå et grupperum uden en session
   * Input : Et request
   * Output: En omdirigering til login siden hvis man ikke er logget ind, eller til groups siden hvis man ikke har valgt gruppe.
   * FIXME: Denne funktion kan udvides til også at indeholde sikkerhed såsom
   *         at sikre sig at userId og groupId stemmer overens.
   *         Hvordan det gøres er dog lettere usikkert.
   */
  noSessionNoAccess(req, res, next) {
    if (!req.session.userId) {
      if (this.debug) {
        console.warn(`Du har ikke et validt userId og er dermed blevet omdirigeret til login siden!`);
      }
      res.redirect(`/login`);
    }
    else if (!req.session.groupId) {
      if (this.debug) {
        console.warn(`Du har ikke et validt groupId og er dermed blevet omdirigeret til login siden!`);
      }
      res.redirect(`/groups`);
    }
    else {
      next();
    }
  }

  /* Formål: Indeholder alt det middleware der kun er relevant i testningsøjemed
   * Input : Non, men aktiveres kun hvis debug er sat til true
   * Output: Mulighed for brug af testværktøjer
   */
  testMiddleware() {
    this.app.use(this.logger);
  }

  /* Formål: Et testværktøj der sørger for at give information til udvikleren om hvordan programmet fungere
   * Input : Et request
   * Output: En log i kommandoprompten som angiver metodevalg, url samt tidspunktet i requestet.
   */
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
