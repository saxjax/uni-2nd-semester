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
    // No Session URLs
    this.app.get(`/about`,    (req, res) => Access.aboutPage(req, res));
    this.app.get(`/register`, (req, res) => Access.registerPage(req, res));
    // idUser Session URLs
    this.app.get(`/login`,    (req, res) => Access.loginPage(req, res));
    // idGroup Session URLs
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
    this.app.get(`/session/group/:idQuery`, (req, res) => Session.groupSession(req, res));
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
   * TODO: de kommenterede (//) har ikke en tilsvarende EJS fil endnu.
   */
  viewPatterns() {
    const Show = new ViewController();
    this.app.get(`/`,                             (req, res) => Show.homePage(req, res));

    // Documents
    // this.app.get(`/view/document/recipient`,  (req, res) => Show.viewDocumentRecipientPage(req, res));
    // this.app.get(`/view/document/expert`,     (req, res) => Show.viewDocumentExpertPage(req, res));
    // this.app.get(`/post/document/`,         (req, res) => Show.postDocumentSelectPage(req, res));
    // this.app.get(`/view/document/:idQuery`,   (req, res) => Show.viewDocumentPage(req, res));
    // this.app.get(`/put/document/:idQuery`, (req, res) => Show.putDocumentPage(req, res));

    // Sections
    this.app.get(`/view/sections/recipient`,         (req, res) => Show.viewSectionsRecipientPage(req, res));
    // this.app.get(`/view/section/expert`,            (req, res) => Show.viewSectionExpertPage(req, res));
    this.app.get(`/view/section/document/:idQuery`, (req, res) => Show.viewSectionDocumentPage(req, res));
    this.app.get(`/post/section`,                 (req, res) => Show.postSectionPage(req, res));
    this.app.get(`/view/section/:idQuery`,          (req, res) => Show.viewSectionPage(req, res));
    // this.app.get(`/put/section/:idQuery`,        (req, res) => Show.putSectionPage(req, res));

    // Evaluations
    this.app.get(`/view/evaluations/recipient`,         (req, res) => Show.viewEvaluationsRecipientPage(req, res));
    // this.app.get(`/view/evaluations/expert`,            (req, res) => Show.viewEvaluationsExpertPage(req, res));
    // this.app.get(`/view/evaluations/document/:idQuery`, (req, res) => Show.viewEvaluationsDocumentPage(req, res));
    this.app.get(`/view/evaluations/section/:idQuery`,  (req, res) => Show.viewEvaluationsSectionPage(req, res));
    /* EVALUATIONS HAR IKKE post, view/:idQuery og put, da evaluations IKKE er et objekt som sådan
     * Evaluations er blot det objekt der håndtere de usecases, hvor man vises for alle ens quiz/flashcard sammen
     */

    // Quiz
    // this.app.get(`/view/quiz/recipient`,         (req, res) => Show.viewQuizRecipientPage(req, res));
    // this.app.get(`/view/quiz/expert`,            (req, res) => Show.viewQuizExpertPage(req, res));
    // this.app.get(`/view/quiz/document/:idQuery`, (req, res) => Show.viewQuizDocumentPage(req, res));
    // this.app.get(`/view/quiz/section/:idQuery`,  (req, res) => Show.viewQuizSectionPage(req, res));
    this.app.get(`/post/quiz`,                 (req, res) => Show.postQuizPage(req, res));
    this.app.get(`/view/quiz/:idQuery`,          (req, res) => Show.viewQuizPage(req, res));
    // this.app.get(`/put/quiz/:idQuery`,        (req, res) => Show.putQuizPage(req, res));

    // Flashcard
    this.app.get(`/view/flashcard/recipient`, (req, res) => Show.viewFlashcardRecipientPage(req, res));
    // this.app.get(`/view/flashcard/expert`, (req, res) => Show.viewFlashcardExpertPage(req, res));
    // this.app.get(`/view/flashcard/document/:idQuery`, (req, res) => Show.viewFlashcardDocumentPage(req, res));
    // this.app.get(`/view/flashcard/section/:idQuery`, (req, res) => Show.viewFlashcardSectionPage(req, res));
    // this.app.get(`/post/flashcard`, (req, res) => Show.postFlashcardPage(req, res));
    // this.app.get(`/view/flashcard/:idQuery`,        (req, res) => Show.viewFlashcardPage(req, res));
    // this.app.get(`/put/flashcard/:idQuery`, (req, res) => Show.putFlashcardPage(req, res));

    // Keywords
    // this.app.get(`/view/keyword/recipient`, (req, res) => Show.viewKeywordRecipientPage(req, res));
    // this.app.get(`/view/keyword/expert`, (req, res) => Show.viewKeywordExpertPage(req, res));
    // this.app.get(`/view/keyword/document/:idQuery`, (req, res) => Show.viewKeywordDocumentPage(req, res));
    // this.app.get(`/view/keyword/section/:idQuery`, (req, res) => Show.viewKeywordSectionPage(req, res));
    // this.app.get(`/view/keyword/quiz/:idQuery`, (req, res) => Show.viewKeywordQuizPage(req, res));
    // this.app.get(`/view/keyword/flashcard/:idQuery`, (req, res) => Show.viewKeywordFlashcardPage(req, res));
    // this.app.get(`/post/keyword`, (req, res) => Show.postKeywordPage(req, res));
    // this.app.get(`/view/keyword/:idQuery`,        (req, res) => Show.viewKeywordPage(req, res));
    // this.app.get(`/put/keyword/:idQuery`, (req, res) => Show.putKeywordPage(req, res));
  }

  /* Formål: At redirecte brugeren hen til det korrekte sted, eller vise den korrekte fejlmeddelse.
   *         Denne controller vil IKKE håndtere nogle ejs filer overhovedet!
   *
   * Input : Non. Her laves blot opsætningen.
   * Output: Opsætning af url'er som kan tilgås via serverens port.
   */
  redirectPatterns() {
    const Redirect = new RedirectController();
    this.app.get(`/dbdown`,                    (req, res) => Redirect.dbdown(req, res));
    this.app.post(`/upload/rapport`,           (req, res) => Redirect.UploadRapport(req, res));
    this.app.post(`/upload/evalueringer`,      (req, res) => Redirect.UploadEvalueringer(req, res));
    this.app.post(`/register`,                 (req, res) => Redirect.RegisterNewUser(req, res));
    this.app.post(`/create/section`,           (req, res) => Redirect.createSection(req, res));
  }

  /* Formål: Struktur for de URL Patterns der indsætter data i databasen.
  *          Vil være den controller der håndtere posting af database, og dermed også sikkerhed.
   * Input : Ingen, denne opsætter blot URLerne
   * Output: Setup af muligheden for klienten at poste data til databasen.
   */
  createPatterns() {
    const Creator = new CreateController();
    this.app.post(`/post/group`, (req, res) => Creator.createGroup(req, res));
    this.app.post(`/post/user`, (req, res) => Creator.createUser(req, res));
    this.app.post(`/post/section`, (req, res) => Creator.createSection(req, res));
    this.app.post(`/post/quiz`, (req, res) => Creator.createQuiz(req, res));
  }

  /* Formål: Struktur for de URL Patterns der sletter data i databasen.
   *         Slettes et "højere" objekt, vil det automatisk slette sine tilhørende underobjekter.
   * Input : Ingen, denne opsætter blot URLerne
   * Output: Setup af muligheden for klienten at delete data.
   * TODO: De udkommenterede (//) er ikke implementeret endnu
   */
  deletePatterns() {
    // const Deletter = new DeletController();
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
    this.app.get(`/test3/:idQuery`, (req, res) => Tester.test3(req, res));
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
      userId: `N/A`,
      idGroup: `N/A`,
      groupName: `N/A`,
      loggedIn: false,
      secret: `SECRET_SALT_CODE_BY_MIKE123456789`,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
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
      req.session.username = `Test User`;
      req.session.loggedIn = true;
      req.session.idUser = `553e422d-7c29-11ea-86e2-2c4d54532c7a`;

      req.session.groupName = `Test Group`;
      req.session.idGroup = `34701dd1-7c29-11ea-86e2-2c4d54532c7a`;
    }
    next();
  }

  /* Formål: At sikre sig at man ikke kan tilgå et grupperum uden en session
   * Input : Et request
   * Output: En omdirigering til login siden hvis man ikke er logget ind, eller til groups siden hvis man ikke har valgt gruppe.
   * FIXME: Denne funktion kan udvides til også at indeholde sikkerhed såsom
   *         at sikre sig at idUser og idGroup stemmer overens.
   *         Hvordan det gøres er dog lettere usikkert.
   */
  noSessionNoAccess(req, res, next) {
    if (isAccessURL(req)) {
      next();
    }
    else if (!req.session.idUser) { // Du har ikke et validt idUser og er dermed blevet omdirigeret til login siden!
      res.redirect(`/login`);
    }
    else if (!req.session.idGroup) { // Du har ikke et validt idUser og er dermed blevet omdirigeret til login siden!
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

function isAccessURL(req) {
  if (/session/.test(req.url)) {
    return true;
  }
  switch (req.url) {
    case `/login`: case `/auth/user`: case `/groups`: case `/register`:
      return true;
    default:
      return false;
  }
}

module.exports = {
  Server,
};
