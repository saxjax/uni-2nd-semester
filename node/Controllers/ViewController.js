/* eslint-disable object-curly-newline */
/* eslint-disable guard-for-in */
/* eslint no-console: off */
const path = require(`path`);
const { Group } = require(`../Models/Group`);
const { User } = require(`../Models/User`);
const { Document } = require(`../Models/Document`);
const { Section } = require(`../Models/Section`);
const { Evaluation } = require(`../Models/Evaluation`);
const { QuizResult } = require(`../Models/QuizResult`);
const { ProgressBar } = require(`../Models/ProgressBar`);

/* Formål: ViewController er den controller som præsentere alle de "views" som brugeren kan se i et grupperum.
 *         ViewControllerens metoder vil dermed alle sammen hente og vise et ejs dokument, hvor der medsendes data.
 *         ViewController vil dermed være den simpleste form, da der ikke bør være nogen form for logik, men alt andet logik bør
 *         henvises til eksempelvis RedirectController (hvis der skal tjekkes for redirects) mv.
 * Input:  Modtager en settingsfil, indeholder serverinstillingerne bestemt i filen serverSettings.js i roden
 */
class ViewController {
  constructor(settings) {
    this.name = `ViewController`;
    this.root = settings.root;
    this.ejs = ``;
  }

  /* Formål: Et overblik til brugeren om den gruppe vedkommende er en del af, samt hvilke muligheder brugeren har.
   * Input : Et request der har oprettet en userId og groupId.
   * Output: Startsiden af hjemmesiden, som skal give et overblik for User, her listes bla. om der er spaced repetition tasks klar til afvikling
   */
  async homePage(req, res) {
    const Recipient = new Group(req);
    const SpacedRep = new QuizResult(req);
    const PB        = new ProgressBar(req);
    const dataArray = await Promise.all([
      Recipient.getThisGroupData(),                   // dataArray[0]
      Recipient.getThisUserData(),                    // dataArray[1]
      Recipient.getAllElementsOfType(`document`),     // dataArray[2]
      SpacedRep.getIdQuizquestionsDueForRepetition(), // dataArray[3]
      PB.getEvaluationsNotYetTaken(),                 // dataArray[4]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], documents: dataArray[2], repetitionTask: dataArray[3], evaluationsNotYetTaken: dataArray[4] };
    this.ejs = path.join(`${this.root}/www/views/home.ejs`);
    res.render(this.ejs, { data });
  }

  /* Document Views */

  /* Formål: At gøre det muligt at oprette et nyt Document
   * Input : En session med userId og groupId
   * Output: En visning af en form som brugeren kan bruge til at oprette et dokument.
   */
  async postDocumentPage(req, res) {
    const Expert = new User(req);
    const dataArray = await Promise.all([
      Expert.getThisGroupData(),               // dataArray[0]
      Expert.getThisUserData(),                // dataArray[1]
    ]);
    const data = { group: dataArray[0], user: dataArray[1] };
    this.ejs = path.join(`${this.root}/www/views/postDocument.ejs`);
    Expert.connect.end();
    res.render(this.ejs, { data });
  }

  /* Formål: At give et overblik over det individuelle dokument, med de sections og evalueringer der er tilknyttet.
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output: Visning af et dokument
   */
  async viewDocumentPage(req, res) {
    const Doc = new Document(req);
    const dataArray = await Promise.all([
      Doc.getThisGroupData(),                 // dataArray[0]
      Doc.getThisUserData(),                  // dataArray[1]
      Doc.getThis(),                          // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewDocument.ejs`);
    Doc.connect.end();
    res.render(this.ejs, { data });
  }

  /* Formål: At hente data, som gør det muligt at vise en side for brugeren med de afsnit, som brugeren har oprettet
   * Input : En session med userId og groupId
   * Output: En liste af de sections som brugeren har oprettet
   */
  async viewSectionExpertPage(req, res) {
    const Expert = new User(req);
    const dataArray = await Promise.all([
      Expert.getThisGroupData(),               // dataArray[0]
      Expert.getThisUserData(),                // dataArray[1]
      Expert.getAllElementsOfType(`section`),  // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], sections: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewSectionsExpert.ejs`);
    Expert.connect.end();
    res.render(this.ejs, { data });
  }

  /* Formål: At vise alle de sektioner som knytter sig til et dokument der er valgt
   * Input : En session med userId og groupId samt et queryId fra params
   * Output: En liste af de sections som tilhører et specifikt dokument
   */
  async viewSectionsAndEvaluationsDocumentPage(req, res) {
    const Doc = new Document(req);
    const dataArray = await Promise.all([
      Doc.getThisGroupData(),                 // dataArray[0]
      Doc.getThisUserData(),                  // dataArray[1]
      Doc.getThis(),                          // dataArray[2]
      Doc.getAllElementsOfType(`section`),    // dataArray[3]
      Doc.getAllElementsOfType(`evaluation`), // dataArray[4]
    ]);
    const data = {
      group: dataArray[0],
      user: dataArray[1],
      document: dataArray[2],
      sections: dataArray[3],
      evaluations: dataArray[4],
    };
    this.ejs = path.join(`${this.root}/www/views/viewSectionsAndEvaluationsDocument.ejs`);
    Doc.connect.end();
    res.render(this.ejs, { data });
  }

  /* Formål: Gør det muligt for en bruger at oprette en section så den er tilkoblet et dokument i gruppen.
   * Input : En session med userId og groupId
   * Output: En visning af en form hvor brugeren kan tilføje en section
   */
  async postSectionPage(req, res) {
    const Doc = new Document(req);
    const dataArray = await Promise.all([
      Doc.getThisGroupData(),               // dataArray[0]
      Doc.getThisUserData(),                // dataArray[1]
      Doc.getThis(),                        // dataArray[2]
      Doc.getAllElementsOfType(`section`),
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2], reservedSections: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/postSection.ejs`);
    Doc.connect.end();
    res.render(this.ejs, { data });
  }

  /* Formål: At hente data, som gør det muligt at vise brugeren al data omhandlende et afsnit (section)
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output: En visning af en enkelt section til brugeren
   */
  async viewSectionPage(req, res) {
    const Sec = new Section(req);
    const dataArray = await Promise.all([
      Sec.getThisGroupData(),               // dataArray[0]
      Sec.getThisUserData(),                // dataArray[1]
      Sec.getThis(),                        // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], section: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewSection.ejs`);
    res.render(this.ejs, { data });
  }

  /* Evaluation Views */

  /* Formål: At hente data, som gør det muligt at vise brugeren alle de evalueringer brugeren selv har oprettet
   * Input : En session med userId og groupId
   * Output: En liste med alle de oprettede evalueringsværktøjer som en bruger har oprettet.
   */
  async viewEvaluationsExpertPage(req, res) {
    const Expert = new User(req);
    const dataArray = await Promise.all([
      Expert.getThisGroupData(),                 // dataArray[0]
      Expert.getThisUserData(),                  // dataArray[1]
      Expert.getAllElementsOfType(`evaluation`), // dataArray[2]
      Expert.getAllElementsOfType(`flashcard`),  // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], evaluations: dataArray[2], flashcards: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewEvaluationsExpert.ejs`);
    res.render(this.ejs, { data });
  }

  /* Formål: At vise et afsnit med alle de tilhørende evalueringer som er mulige at tage til dette afsnit.
   * Input : En session med userId og groupId og queryId fra params
   * Output: En liste med alle de evalueringer der er tilknyttet en section
   */
  async viewEvaluationsSectionPage(req, res) {
    const Sec = new Section(req);
    const dataArray = await Promise.all([
      Sec.getThisGroupData(),                 // dataArray[0]
      Sec.getThisUserData(),                  // dataArray[1]
      Sec.getThis(),                          // dataArray[2]
      Sec.getAllElementsOfType(`evaluation`), // dataArray[3]
      Sec.getAllElementsOfType(`flashcard`),  // dataArray[4]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2], evaluations: dataArray[3], flashcards: dataArray[4] };
    this.ejs = path.join(`${this.root}/www/views/viewEvaluationsSection.ejs`);
    Sec.connect.end();
    res.render(this.ejs, { data });
  }

  /* Evaluation Views */

  /* Formål: At gøre det muligt for en bruger dynamisk at oprette en evaluering så den er tillagt en
             section (og sectionens document), med et ubestemt antal spørgsmål og svarmuligheder.
   * Input : En session med userId og groupId (og muligvis document/section id?)
   * Output: En præsentation af den form der gør det muligt at oprette en evaluering
   */
  async postEvaluationDocumentPage(req, res) {
    const Doc = new Document(req);
    const dataArray = await Promise.all([
      Doc.getThisGroupData(),               // dataArray[0]
      Doc.getThisUserData(),                // dataArray[1]
      Doc.getThis(),                        // dataArray[2]
      Doc.getAllElementsOfType(`Section`),  // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2], sections: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/postEvaluationDocument.ejs`);
    Doc.connect.end();
    res.render(this.ejs, { data });
  }

  /* Formål: At vise en side for brugeren, hvor brugeren kan oprette et nyt afsnit til et dokument */
  async postEvaluationSectionPage(req, res) {
    const Sec = new Section(req);
    const dataArray = await Promise.all([
      Sec.getThisGroupData(), // dataArray[0]
      Sec.getThisUserData(),  // dataArray[1]
      Sec.getThis(),          // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], section: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/postEvaluationSection.ejs`);
    Sec.connect.end();
    res.render(this.ejs, { data });
  }

  /* Formål: At vise en side, hvorpå brugeren kan oprette/tilknytte spørgsmål til sin evaluering */
  async postQuestionsPage(req, res) {
    const E = new Evaluation(req);
    const data = { user: await E.getThisUserData() };
    this.ejs = path.join(`${this.root}/www/views/postQuestions.ejs`);
    res.render(this.ejs, { data });
  }

  /* Formål: Viser siden til en evaluering som en bruger kan tage
   * Input : Et request med et queryId med et evaluation-ID samt en session med userId og groupId
   * Output: En fremvisning af en evaluering og dens tilhørende opgaver så en bruger kan tage den
   */
  async viewEvaluationPage(req, res) {
    const E = new Evaluation(req);
    const dataArray = await Promise.all([
      await E.getThisGroupData(),    // dataArray[0]
      await E.getThisUserData(),     // dataArray[1]
      await E.getThis(),             // dataArray[2]
      await E.getAllQuizQuestions(), // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], evaluation: dataArray[2], questions: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewEvaluation.ejs`);
    E.connect.end();
    res.render(this.ejs, { data });
  }

  /* Formål: At vise de spørgsmål, som brugeren skal svare på i følge spaced repetition-algoritmen */
  async viewSpacedRepetitionPage(req, res) {
    const QR = new QuizResult(req);
    const dataArray = await Promise.all([
      await QR.getThisGroupData(),                    // dataArray[0]
      await QR.getThisUserData(),                     // dataArray[1]
      await QR.getThis(),                             // dataArray[2]
      await QR.getTasksforRepetition(),               // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], evaluation: dataArray[2], questions: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewEvaluation.ejs`);
    QR.connect.end();
    res.render(this.ejs, { data });
  }

  /* Formål: At vise resultatet af en brugers færdiggjorte evaluering */
  async viewEvaluationResultPage(req, res) {
    const QR = new QuizResult(req);
    const dataArray = await Promise.all([
      await QR.getThisGroupData(),                    // dataArray[0]
      await QR.getThisUserData(),                     // dataArray[1]
      await QR.getThis(),                             // dataArray[2]
      await QR.getAllQuizQuestions(),                 // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], evaluation: dataArray[2],   quizQuestions: dataArray[3] };

    this.ejs = path.join(`${this.root}/www/views/viewEvaluationResult.ejs`);
    QR.connect.end();
    res.render(this.ejs, { data });
  }

  /* Formål: En API som stiller data til rådighed for progressbaren */
  async viewEvaluationProgress(req, res) {
    const PB = new ProgressBar(req);
    const takenEvalProgress = await PB.getProgressFromDB();
    const totalP = takenEvalProgress.totalProgress;
    const correctP = takenEvalProgress.totalCorrectProgress;
    PB.connect.end();
    res.send({ totalProgress: totalP, correctProgress: correctP });
  }
}

module.exports = {
  ViewController,
};
