/* eslint no-console: off */

const express = require(`express`);
const upload = require(`express-fileupload`);
const session = require(`express-session`);
const MySQLStore = require(`express-mysql-session`)(session);
const bodyParser = require(`body-parser`);

const { ViewController } = require(`./Controllers/ViewController`);
const { AccessController } = require(`./Controllers/AccessController`);
const { SessionController } = require(`./Controllers/SessionController`);
const { CreateController } = require(`./Controllers/CreateController`);
const { DeleteController } = require(`./Controllers/DeleteController`);
const { TestController } = require(`./Controllers/TestController`);
const { Database } = require(`./Models/AbstractClasses/Database`);
const pad = require(`./HelperFunctions/Pad`);

/* Formål: MasterController er et objekt der opretter webapplikationen.
 *         MasterController fungere dermed som den primære indgangsvinkel til programmet, og alle dele af programmet kan udledes herfra.
 *         MasterController konstrueres ud fra nogle definerede settings, så det er muligt at opstarte en server i forskellige tilstande.
 */
class MasterController {
  constructor(settings) {
    this.app        = express();
    this.settings   = settings;
    this.name       = settings.name;
    this.root       = settings.root;
    this.port       = settings.port;
    this.debug      = settings.debug;
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
    this.checkLogin();
    if (this.debug) {
      this.testMiddleware();
    }

    this.sessionPatterns();
    this.accessPatterns();
    this.viewPatterns();
    this.createPatterns();
    this.deletePatterns();
    if (this.debug) {
      this.testPatterns();
    }

    return this.app.listen(this.port, () => console.log(`${this.name} startin up on http://localhost:${this.port}/`));
  }

  /* Formål: At opstille alle de funktioner som loader og viser de ejs filer
             der skal bruges for at tilgå et grupperum
   * Input : Non. Her laves blot opsætningen.
   * Output: Opsætning af url'er som kan tilgås via serverens port.
   */
  accessPatterns() {
    const Access = new AccessController(this.settings);
    this.app.get(`/dbdown`,             (req, res) => Access.dbDown(req, res));
    // No Session URLs
    this.app.get(`/access/about`,       (req, res) => Access.aboutPage(req, res));
    this.app.get(`/access/register`,    (req, res) => Access.registerPage(req, res));
    // idUser Session URLs
    this.app.get(`/access/login`,       (req, res) => Access.loginPage(req, res));
    // idGroup Session URLs
    this.app.get(`/access/view/groups`, (req, res) => Access.viewGroupsPage(req, res));
    this.app.get(`/access/post/group`,  (req, res) => Access.postGroupPage(req, res));
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
    const Session = new SessionController(this.settings);
    this.app.post(`/session/auth/user`,     (req, res) => Session.userSession(req, res));
    this.app.get(`/session/group/:idQuery`, (req, res) => Session.groupSession(req, res));
    this.app.get(`/session/logout`,         (req, res) => Session.logout(req, res));
  }

  /* Formål: At opstille alle de funktioner som loader en ejs fil og viser en side i et grupperum
   *         Et view url er på denne form:
   *         /typeAfView / ObjectNavnDerØnskes / IdEllerObjectNavnSomDefinereScopetAfDetØnskedeObject /
   *           Evt.EkstraParametreHvisSammeQuerySkalVisesForskelligtIForskelligeSammenhænge
   *
   *        TypeAfView vil typisk enten være en selsvtændig hardcoded EJS fil (såsom /about) eller knytte sig til et objekt (se herunder)
   *          Ønskes der flere funktionaliteter (såsom et view der både viser dokumenter samt præsentere formen for at oprette en ny), så
   *          skal TypeAfView blot være "/viewAndpost" eksempelvis.
   *         TypeAfView eksemplerne herunder knytter sig til et objekt.
   *           /view angiver at det er en side der kun skal ses,
   *           /post angiver at der vises en form som opretter objektet
   *           /put angiver at der vises en form, hvor man kan ændrer objektet
   *           DER ER INGEN /delete, da det ikke kræver en seperat visning, men blot
   *             kan være en enkelt knap i et /view (evt. med en "er du sikker?")
   *           "/" er lidt speciel da den tæller for startsiden.
   *         Alle objekter vil have et medfølgende idQuery, /recipient, /expert, /document eller /section,
   *           da det indikere hvad man får vist. (idQuery for et bestemt, unikt object,
   *           /recipient for alle objekter brugeren har adgang til i den valgte gruppe og
   *           /expert for alle objekter brugeren har oprettet i den valgte gruppe.
   *           /document(el. /section)/ :idQuery for de section/evalueringer/keywords
   *             der knytter sig til et unikt dokument/section, fremfor hele gruppen.
   * Input : Non. Her laves blot opsætningen.
   * Output: Opsætning af url'er som kan tilgås via serverens port.
   */
  viewPatterns() {
    const Show = new ViewController(this.settings);
    this.app.get(`/`,                                              (req, res) => Show.homePage(req, res));
    // Documents
    this.app.get(`/post/document/`,                                (req, res) => Show.postDocumentPage(req, res));
    this.app.get(`/view/document/:idQuery`,                        (req, res) => Show.viewDocumentPage(req, res));
    // Sections
    this.app.get(`/view/sections/expert`,                          (req, res) => Show.viewSectionExpertPage(req, res));
    this.app.get(`/view/sectionsAndEvaluations/document/:idQuery`, (req, res) => Show.viewSectionsAndEvaluationsDocumentPage(req, res));
    this.app.get(`/post/section/:idQuery`,                         (req, res) => Show.postSectionPage(req, res));
    this.app.get(`/view/section/:idQuery`,                         (req, res) => Show.viewSectionPage(req, res));
    // Evaluations
    this.app.get(`/view/evaluations/expert`,                       (req, res) => Show.viewEvaluationsExpertPage(req, res));
    this.app.get(`/view/evaluations/section/:idQuery`,             (req, res) => Show.viewEvaluationsSectionPage(req, res));
    this.app.get(`/post/evaluation/section/:idQuery`,              (req, res) => Show.postEvaluationSectionPage(req, res));
    this.app.get(`/post/questions`,                                (req, res) => Show.postQuestionsPage(req, res));
    this.app.get(`/view/evaluations/:idQuery`,                     (req, res) => Show.viewEvaluationPage(req, res));// idQuery indeholder et evaluation id
    this.app.get(`/view/SpacedRepetition`,                         (req, res) => Show.viewSpacedRepetitionPage(req, res));
    this.app.get(`/view/evaluationResult/:idAttempt`,              (req, res) => Show.viewEvaluationResultPage(req, res));
    this.app.get(`/api/evaluationProgress`,                        (req, res) => Show.apiEvaluationProgress(req, res));
  }

  /* Formål: Struktur for de URL Patterns der indsætter data i databasen.
  *          Vil være den controller der håndtere posting af database, og dermed også sikkerhed.
  * Input : Ingen, denne opsætter blot URLerne
  * Output: Setup af muligheden for klienten at poste data til databasen.
  */
  createPatterns() {
    const Creator = new CreateController(this.settings);
    this.app.post(`/post/group`,      (req, res) => Creator.createGroup(req, res));
    this.app.post(`/access/register`, (req, res) => Creator.RegisterNewUser(req, res));
    this.app.post(`/post/document`,   (req, res) => Creator.createDocument(req, res));
    this.app.post(`/post/section`,    (req, res) => Creator.createSection(req, res));
    this.app.post(`/post/evaluation`, (req, res) => Creator.createEvaluation(req, res));
    this.app.post(`/post/questions`,  (req, res) => Creator.createQuestions(req, res));
    this.app.post(`/post/answers`,    (req, res) => Creator.createAnswers(req, res));
  }

  /* Formål: Struktur for de URL Patterns der sletter data i databasen.
   *         Slettes et "højere" objekt, vil det automatisk slette sine tilhørende underobjekter.
   * Input : Ingen, denne opsætter blot URLerne
   * Output: Setup af muligheden for klienten at delete data.
   */
  deletePatterns() {
    const Deletter = new DeleteController(this.settings);
    this.app.delete(`/delete/evaluation/section/:idQuery`, (req, res) => Deletter.deleteSection(req, res));
  }

  /* Formål: En "catch all" for alle de tests der ønskes at blive lavet, så de ikke "clutter" de andre URL'er til.
             Alle test skal dog helst følge formattet "/test/IndsætHvadDuVilHer"
             Test URL's må meget gerne fjernes efter deres test er implementeret.
   * Input : Unikt for hver url, da dette er lavet for at teste
   * Output: Setup af muligheden for udviklere at teste ting før de implementeres.
   */
  testPatterns() {
    const Tester = new TestController(this.settings);
    this.app.get(`/test`,           (req, res) => Tester.test(req, res));
    this.app.get(`/test2`,          (req, res) => Tester.test2(req, res));
    this.app.get(`/test3`,          (req, res) => Tester.test3(req, res));
    this.app.get(`/test3/:idQuery`, (req, res) => Tester.test3(req, res));
    this.app.get(`/whatever`,       (req, res) => Tester.whatever(req, res));
  }

  /* Formål: Opsætning af en viewEngine så det er muligt at render ejs filer.
   * Input : En request for en ejs fil
   * Output: Muligheden for at sende ejs filer i et format så clienten kan render det.
   */
  viewEngineMiddleware() {
    this.app.set(`view engine`, `ejs`);
  }

  /* Formål: Checker om brugeren er logged ind eller ej, og sender det med som en local variabel i response.
             Dette gøres på alle views inden render / redirect.
   * Input : et request
   * Output: local variabel med loggedin information.
   */
  checkLogin() {
    this.app.use((req, res, next) => {
      res.locals.isloggedin = req.session.loggedIn;
      next();
    });
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
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  /* Formål: At opstille den session som gør at programmet kan "huske" hvilken gruppe man er en del af samt hvilken bruger man er
   * Input : Non
   * Output: Muligheden for at tilgå req.session, samt et autogeneret login hvis man har sat skipAccess i settings til true.
   */
  sessionMiddleware() {
    const dbconnection = new Database();
    const sessionStore = new MySQLStore(dbconnection.dbConfig);
    this.app.use(session({
      key: `user_sid`,
      userId: `N/A`,
      idGroup: `N/A`,
      groupName: `N/A`,
      loggedIn: false,
      secret: `SECRET_SALT_CODE`,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: { maxAge: 3600000, sameSite: `lax`, secure: false },
    }));
    if (this.skipAccess) {
      this.app.use(this.createTestUserAndidGroup);
    }
    this.app.use(this.noSessionNoAccess);
  }

  /* Formål: At skabe et user og group Id i tilfælde af at man i udviklingsmode ønsker at skippe login/gruppevalgs fasen.
   * Input : Et request
   * Output: En fuldt oprettet session for user og group data.
   */
  createTestUserAndidGroup(req, res, next) {
    if (!req.session.idUser || !req.session.idGroup) {
      req.session.username  = `Test User`;
      req.session.loggedIn  = true;
      req.session.idUser    = `553e422d-7c29-11ea-86e2-2c4d54532c7a`;
      req.session.groupName = `Test Group`;
      req.session.idGroup   = `34701dd1-7c29-11ea-86e2-2c4d54532c7a`;
    }
    next();
  }

  /* Formål: At sikre sig at man ikke kan tilgå et grupperum uden en session
   * Input : Et request
   * Output: En omdirigering til login siden hvis man ikke er logget ind, eller til groups siden hvis man ikke har valgt gruppe.
   */
  noSessionNoAccess(req, res, next) {
    if (isAccessURL(req)) {
      next();
    }
    else if (!req.session.idUser) { // Du har ikke et validt idUser og er dermed blevet omdirigeret til login siden!
      res.redirect(`/access/login`);
    }
    else if (!req.session.idGroup) { // Du har ikke et validt idUser og er dermed blevet omdirigeret til login siden!
      res.redirect(`/access/view/groups`);
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

  /* Formål: Et testværktøj der sørger for at give information til udvikleren om indgående requests
   * Input : Et request
   * Output: En log i kommandoprompten som angiver metodevalg, url samt tidspunktet i requestet.
   */
  logger(req, res, next) {
    const reqMethod = pad(req.method, -6, ` `);
    const reqUrl    = `${req.protocol}://${req.get(`host`)}${req.originalUrl}`;
    const now       = new Date();
    const date      = `${pad(now.getDate(), -2, `0`)}/${pad(now.getMonth(), -2, `0`)}/${now.getFullYear()}`;
    const time      = `${pad(now.getHours(), -2, `0`)}:${pad(now.getMinutes(), -2, `0`)}:${pad(now.getSeconds(), -2, `0`)}`;
    console.log(`${date} ${time} - GOT ${reqMethod}: ${reqUrl}`);
    next();
  }
}

function isAccessURL(req) {
  if (/access/.test(req.url) || /session/.test(req.url) || req.url === `/post/group`) {
    return true;
  }
  return false;
}

module.exports = {
  MasterController,
};
