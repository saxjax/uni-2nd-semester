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
const { Flashcard } = require(`../Models/Flashcard`);
const { Keyword } = require(`../Models/Keyword`);

/* ViewController er den controller som præsentere alle de "views" som brugeren kan se i et grupperum.
 * ViewControllerens metoder vil dermed alle sammen hente og vise et ejs dokument, hvor der medsendes data.
 * ViewController vil dermed være den simpleste form, da der ikke bør være nogen form for logik, men alt andet logik bør
 * henvises til eksempelvis RedirectController (hvis der skal tjekkes for redirects) mv.
 */

class ViewController {
  constructor(root) {
    this.name = `ViewController`;
    this.root = root;
    this.ejs = ``;
  }

  /* Formål: Et overblik til brugeren om den gruppe vedkommende er en del af, samt hvilke muligheder brugeren har.
   * Input : Et request der har oprettet en userId og groupId.
   * Output: Startsiden af hjemmesiden, som skal give et overblik for User, her listes bla. om der er spaced repetition tasks klar til afvikling
   */
  async homePage(req, res) {
    const Recipient = new Group(req);
    const SpacedRep = new QuizResult(req);
    const dataArray = await Promise.all([
      Recipient.getThisGroupData(),               // dataArray[0]
      Recipient.getThisUserData(),                // dataArray[1]
      Recipient.getAllElementsOfType(`Document`), // dataArray[2]
      SpacedRep.getIdQuizquestionsDueForRepetition(), // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], documents: dataArray[2], repetitionTask: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/home.ejs`);
    res.render(this.ejs, { data });
  }

  /* Document Views TODO: */

  // TODO: Mangler EJS fil
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med groupId
   * Output: En liste af de dokumenter som er lagt op i gruppen.
   */
  async viewDocumentRecipientPage(req, res) {
    const Recipient = new Group(req);
    const dataArray = await Promise.all([
      Recipient.getThisGroupData(),               // dataArray[0]
      Recipient.getThisUserData(),                // dataArray[1]
      Recipient.getAllElementsOfType(`Document`), // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], documents: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewDocumentRecipient.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS fil
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId
   * Output: En liste af dokumenter som brugeren har lagt op.
   */
  async viewDocumentExpertPage(req, res) {
    const Expert = new User(req);
    const dataArray = await Promise.all([
      Expert.getThisGroupData(),               // dataArray[0]
      Expert.getThisUserData(),                // dataArray[1]
      Expert.getAllElementsOfType(`Document`), // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], documents: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewDocumentExpert.ejs`);
    res.render(this.ejs, { data });
  }

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
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS fil
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output: Ens dokument data med mulighed for at rette i det.
   */
  async putDocumentPage(req, res) {
    const Doc = new Document(req);
    const dataArray = await Promise.all([
      Doc.getThisGroupData(),               // dataArray[0]
      Doc.getThisUserData(),                // dataArray[1]
      Doc.getThis(),                        // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/putDocument.ejs`);
    res.render(this.ejs, { data });
  }

  /* Section Views TODO: */

  // TODO: Mangler EJS fil
  /* Formål: At vise alle de sektioner som er tilgængelige for en bruger i en gruppe.
   * Input : En session med userId og groupId
   * Output: En liste af de sections som er lagt op i gruppen.
   */
  async viewSectionsRecipientPage(req, res) {
    const Recipient = new Group(req);
    const dataArray = await Promise.all([
      Recipient.getThisGroupData(),               // dataArray[0]
      Recipient.getThisUserData(),                // dataArray[1]
      Recipient.getAllElementsOfType(`Section`),  // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], sections: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewSectionsRecipient.ejs`);
    res.render(this.ejs, { data });
  }

  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId
   * Output: En liste af de sections som brugeren har oprettet
   */
  async viewSectionExpertPage(req, res) {
    const Expert = new User(req);
    const dataArray = await Promise.all([
      Expert.getThisGroupData(),               // dataArray[0]
      Expert.getThisUserData(),                // dataArray[1]
      Expert.getAllElementsOfType(`Section`),  // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], sections: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewSectionsExpert.ejs`);
    res.render(this.ejs, { data });
  }

  /* Formål: At vise alle de sektioner som knytter sig til et dokument der er valgt
   * Input : En session med userId og groupId samt et queryId fra params
   * Output: En liste af de sections som tilhører et specifikt dokument
   */
  async viewSectionDocumentPage(req, res) {
    const Doc = new Document(req);
    const dataArray = await Promise.all([
      Doc.getThisGroupData(),               // dataArray[0]
      Doc.getThisUserData(),                // dataArray[1]
      Doc.getThis(),                        // dataArray[2]
      Doc.getAllElementsOfType(`Section`),  // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2], sections: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewSectionDocument.ejs`);
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
      Doc.getAllElementsOfType(`Section`),    // dataArray[3]
      Doc.getAllElementsOfType(`Evaluation`), // dataArray[4]
      Doc.getAllElementsOfType(`Keyword`),    // dataArray[5]
    ]);
    const data = { 
      group: dataArray[0],
      user: dataArray[1],
      document: dataArray[2],
      sections: dataArray[3],
      evaluations: dataArray[4],
      keywords: dataArray[5],
    };
    this.ejs = path.join(`${this.root}/www/views/viewSectionsAndEvaluationsDocument.ejs`);
    res.render(this.ejs, { data });
  }

  /* Formål: Gør det muligt for en bruger at oprette en section så den er tilkoblet et dokument i gruppen.
   * Input : En session med userId og groupId
   * Output: En visning af en form hvor brugeren kan tilføje en section
   * FIXME: Som det står nu er sections DOCUMENT_ID blot sat til null, og formålet er dermed ikke opfyldt.
   * FIXME: Denne funktion skal gerne, på en eller anden måde, kunne vurdere om der er valgt et dokument/section på forhånd
   *        som denne post skal knyttes til.
   *        Det er vigtigt, at strukturen for hvordan det løses på, er den samme for alle de andre URL'er.
   */
  async postSectionPage(req, res) {
    const Doc = new Document(req);
    const dataArray = await Promise.all([
      Doc.getThisGroupData(),               // dataArray[0]
      Doc.getThisUserData(),                // dataArray[1]
      Doc.getThis(),                        // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/postSection.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
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

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output: En præsentation af en section i en form som kan ændres
   */
  async putSectionPage(req, res) {
    const Sec = new Section(req);
    const dataArray = await Promise.all([
      Sec.getThisGroupData(),               // dataArray[0]
      Sec.getThisUserData(),                // dataArray[1]
      Sec.getThis(),                        // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], section: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/putSection.ejs`);
    res.render(this.ejs, { data });
  }

  /* Evaluation Views TODO: */

  /* Formål: At vise alle de tilgængelige evalueringer som en bruger kan give sig i kast med.
   * Input : En session med userId og groupId
   * Output: En liste med alle de oprettede evalueringsværktøjer som er i gruppen
   */
  async viewEvaluationsRecipientPage(req, res) {
    const Recipient = new Group(req);
    const dataArray = await Promise.all([
      Recipient.getThisGroupData(),                // dataArray[0]
      Recipient.getThisUserData(),                 // dataArray[1]
      Recipient.getAllElementsOfType(`Evaluation`),      // dataArray[2]
      Recipient.getAllElementsOfType(`Flashcard`), // dataArray[3]   ->   FIXME: Ikke oprettet endnu
    ]);
    const data = { group: dataArray[0], user: dataArray[1], evaluations: dataArray[2], flashcards: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewEvaluationsRecipient.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId
   * Output: En liste med alle de oprettede evalueringsværktøjer som en bruger har oprettet.
   */
  async viewEvaluationsExpertPage(req, res) {
    const Expert = new User(req);
    const dataArray = await Promise.all([
      Expert.getThisGroupData(),                // dataArray[0]
      Expert.getThisUserData(),                 // dataArray[1]
      Expert.getAllElementsOfType(`Evaluation`),      // dataArray[2]
      Expert.getAllElementsOfType(`Flashcard`), // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], evaluations: dataArray[2], flashcards: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewEvaluationsExpert.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId og queryId fra params
   * Output: En liste af alle de evalueringer der er tilknyttet et dokument
   */
  async viewEvaluationsDocumentPage(req, res) {
    const Doc = new Document(req);
    const dataArray = await Promise.all([
      Doc.getThisGroupData(),                // dataArray[0]
      Doc.getThisUserData(),                 // dataArray[1]
      Doc.getThis(),                         // dataArray[2]
      Doc.getAllElementsOfType(`Evaluation`),      // dataArray[3]
      Doc.getAllElementsOfType(`Flashcard`), // dataArray[4]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2], evaluation: dataArray[3], flashcards: dataArray[4] };
    this.ejs = path.join(`${this.root}/www/views/viewEvaluationsDocument.ejs`);
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
      Sec.getAllElementsOfType(`Evaluation`),       // dataArray[3]
      Sec.getAllElementsOfType(`Flashcard`),  // dataArray[4]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2], evaluations: dataArray[3], flashcards: dataArray[4] };
    this.ejs = path.join(`${this.root}/www/views/viewEvaluationsSection.ejs`);
    res.render(this.ejs, { data });
  }

  /* Evaluation Views TODO: */

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId
   * Output: En liste af alle de evalueringer som er tilgængelige for en bruger
   */
  async viewEvaluationRecipientPage(req, res) {
    const Recipient = new Group(req);
    const dataArray = await Promise.all([
      Recipient.getThisGroupData(),               // dataArray[0]
      Recipient.getThisUserData(),                // dataArray[1]
      Recipient.getAllElementsOfType(`Evaluation`),     // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], evaluations: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewEvaluationRecipient.ejs`);
    res.render(this.ejs, { data });
  }

  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId
   * Output: En liste af alle de evalueringer som en User har oprettet
   */
  async viewEvaluationExpertPage(req, res) {
    const Expert = new User(req);
    const dataArray = await Promise.all([
      Expert.getThisGroupData(),               // dataArray[0]
      Expert.getThisUserData(),                // dataArray[1]
      Expert.getAllElementsOfType(`Evaluation`),     // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], evaluations: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewEvaluationExpert.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId og queryId fra params
   * Output: En liste af alle de evaluations som er tilknyttet dokumentet
   */
  async viewEvaluationDocumentPage(req, res) {
    const Doc = new Document(req);
    const dataArray = await Promise.all([
      Doc.getThisGroupData(),               // dataArray[0]
      Doc.getThisUserData(),                // dataArray[1]
      Doc.getThis(),                        // dataArray[2]
      Doc.getAllElementsOfType(`Evaluation`),     // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2], evaluations: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewDocument.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId og queryId fra params
   * Output: En liste med evalueringer tilhørende en section
   */
  async viewEvaluationSectionPage(req, res) {
    const Sec = new Section(req);
    const dataArray = await Promise.all([
      Sec.getThisGroupData(),               // dataArray[0]
      Sec.getThisUserData(),                // dataArray[1]
      Sec.getThis(),                        // dataArray[2]
      Sec.getAllElementsOfType(`Evaluation`),  // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], section: dataArray[2], evaluations: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewEvaluationSection.ejs`);
    res.render(this.ejs, { data });
  }

  /* Formål: At gøre det muligt for en bruger dynamisk at oprette en evaluering så den er tillagt en
             section (og sectionens document), med et ubestemt antal spørgsmål og svarmuligheder.
   * Input : En session med userId og groupId (og muligvis document/section id?)
   * Output: En præsentation af den form der gør det muligt at oprette en evaluering
   * FIXME: Denne funktion skal gerne, på en eller anden måde, kunne vurdere om der er valgt et dokument/section på forhånd
   *        som denne post skal knyttes til.
   *        Det er vigtigt, at strukturen for hvordan det løses på, er den samme for alle de andre URL'er.
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
    res.render(this.ejs, { data });
  }

  async postEvaluationSectionPage(req, res) {
    const Sec = new Section(req);
    const dataArray = await Promise.all([
      Sec.getThisGroupData(),               // dataArray[0]
      Sec.getThisUserData(),                // dataArray[1]
      Sec.getThis(),                        // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], section: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/postEvaluationSection.ejs`);
    res.render(this.ejs, { data });
  }

  // FIXME: Mangler korrekt brug af Promise.all()
  async postQuestionsPage(req, res) {
    const E = new Evaluation(req);
    const data = {
      group: await E.getThisGroupData(),
      user: await E.getThisUserData(),
      evaluation: await E.getThis(),
      // questions: await Q.getAllElementsOfType(`QuizQuestion`),
    };
    Promise.all([data.group, data.user, data.evaluation, data.questions]);
    this.ejs = path.join(`${this.root}/www/views/postQuestions.ejs`);
    res.render(this.ejs, { data });
  }


  /* Formål: Viser siden til en evaluering som en bruger kan tage
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output: En fremvisning af en evaluering og dens tilhørende opgaver så en bruger kan tage den
   */
  async viewEvaluationPage(req, res) {
    const E = new Evaluation(req);
    const dataArray = await Promise.all([
      await E.getThisGroupData(),                    // dataArray[0]
      await E.getThisUserData(),                     // dataArray[1]
      await E.getThis(),                             // dataArray[2]
      await E.getAllQuizQuestions(),                 // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], evaluation: dataArray[2], questions: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewEvaluation.ejs`);
    res.render(this.ejs, { data });
  }


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
    res.render(this.ejs, { data });
  }


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
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output: En fremvisning af en evaluering og dens tilhørende spørgsmål/svar så en bruger kan rette den til
   */
  async putEvaluationPage(req, res) {
    const E = new Evaluation(req);
    const dataArray = await Promise.all([
      E.getThisGroupData(),                    // dataArray[0]
      E.getThisUserData(),                     // dataArray[1]
      E.getThis(),                             // dataArray[2]
      E.getAllElementsOfType(`QuizQuestion`),  // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], evaluation: dataArray[2], questions: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/putEvaluation.ejs`);
    res.render(this.ejs, { data });
  }


  /* Flashcard Views TODO: */

  /* Formål: En fremstilling af alle de flashcard som en bruger har adgang til.
   * Input : En session med userId og groupId
   * Output: En liste af flashcards som en bruger kan tage
   */
  async viewFlashcardRecipientPage(req, res) {
    const Recipient = new Group(req);  // fejl?
    const dataArray = await Promise.all([
      Recipient.getThisGroupData(),                 // dataArray[0]
      Recipient.getThisUserData(),                  // dataArray[1]
      Recipient.getAllElementsOfType(`Flashcard`),  // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], flashcards: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewFlashcardRecipient.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId
   * Output: En liste af flashcards som er tilknyttet brugeren
   */
  async viewFlashcardExpertPage(req, res) {
    const Expert = new User(req);
    const dataArray = await Promise.all([
      Expert.getThisGroupData(),                 // dataArray[0]
      Expert.getThisUserData(),                  // dataArray[1]
      Expert.getAllElementsOfType(`Flashcard`),  // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], flashcards: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewFlashcardExpert.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId
   * Output: En liste af flashcards der findes i et bestemt dokument
   */
  async viewFlashcardDocumentPage(req, res) {
    const Doc = new Document(req);
    const dataArray = await Promise.all([
      Doc.getThisGroupData(),                 // dataArray[0]
      Doc.getThisUserData(),                  // dataArray[1]
      Doc.getThis(),                          // dataArray[2]
      Doc.getAllElementsOfType(`Flashcard`),  // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2], flashcards: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewFlashcardDocument.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId
   * Output: En liste af flashcards tilhørende en section
   */
  async viewFlashcardSectionPage(req, res) {
    const Sec = new Section(req);
    const dataArray = await Promise.all([
      Sec.getThisGroupData(),                 // dataArray[0]
      Sec.getThisUserData(),                  // dataArray[1]
      Sec.getThis(),                          // dataArray[2]
      Sec.getAllElementsOfType(`Flashcard`),  // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], section: dataArray[2], flashcards: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewFlashcardSection.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId (og muligvis document/section id?)
   * Output: En form som gør det muligt for brugeren at POST et flashcard
   * FIXME: Denne funktion skal gerne, på en eller anden måde, kunne vurdere om der er valgt et dokument/section på forhånd
   *        som denne post skal knyttes til.
   *        Det er vigtigt, at strukturen for hvordan det løses på, er den samme for alle de andre URL'er.
   */
  async postFlashcardPage(req, res) {
    const Expert = new User(req);
    const dataArray = await Promise.all([
      Expert.getThisGroupData(),               // dataArray[0]
      Expert.getThisUserData(),                // dataArray[1]
    ]);
    const data = { group: dataArray[0], user: dataArray[1] };
    this.ejs = path.join(`${this.root}/www/views/postFlashcard.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output: Et enkelt flashcard
   */
  async viewFlashcardPage(req, res) {
    const F = new Flashcard(req);
    const dataArray = await Promise.all([
      F.getThisGroupData(),               // dataArray[0]
      F.getThisUserData(),                // dataArray[1]
      F.getThis(),                        // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], flashcard: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewDocument.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output: En form der gør det muligt opdateret et flashcard
   */
  async putFlashcardPage(req, res) {
    const F = new Flashcard(req);
    const dataArray = await Promise.all([
      F.getThisGroupData(),               // dataArray[0]
      F.getThisUserData(),                // dataArray[1]
      F.getThis(),                        // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], flashcard: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/putFlashcard.ejs`);
    res.render(this.ejs, { data });
  }

  /* Keyword Views TODO: */

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId
   * Output: En liste af alle keywords som er til stede i Group
   */
  async viewKeywordRecipientPage(req, res) {
    const Recipient = new Group(req);
    const dataArray = await Promise.all([
      Recipient.getThisGroupData(),               // dataArray[0]
      Recipient.getThisUserData(),                // dataArray[1]
      Recipient.getAllElementsOfType(`Keyword`),  // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], keywords: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewKeywordRecipient.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId
   * Output: En liste af alle keywords en bruger har oprettet
   */
  async viewKeywordExpertPage(req, res) {
    const Expert = new User(req);
    const dataArray = await Promise.all([
      Expert.getThisGroupData(),               // dataArray[0]
      Expert.getThisUserData(),                // dataArray[1]
      Expert.getAllElementsOfType(`Keyword`),  // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], keywords: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewKeywordExpert.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId og queryId fra params
   * Output: En liste med alle de keywords der er i et dokument
   */
  async viewKeywordDocumentPage(req, res) {
    const Doc = new Document(req);
    const dataArray = await Promise.all([
      Doc.getThisGroupData(),               // dataArray[0]
      Doc.getThisUserData(),                // dataArray[1]
      Doc.getThis(),                        // dataArray[2]
      Doc.getAllElementsOfType(`Keyword`),  // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2], keywords: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewKeywordDocument.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId og queryId fra params
   * Output: En liste med alle de keywords forbundet til en section
   */
  async viewKeywordSectionPage(req, res) {
    const Sec = new Section(req);
    const dataArray = await Promise.all([
      Sec.getThisGroupData(),               // dataArray[0]
      Sec.getThisUserData(),                // dataArray[1]
      Sec.getThis(),                        // dataArray[2]
      Sec.getAllElementsOfType(`Keyword`),  // dataArray[3]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], section: dataArray[2], keywords: dataArray[3] };
    this.ejs = path.join(`${this.root}/www/views/viewKeywordSection.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : En session med userId og groupId (og muligvis document/section id?)
   * Output: En form hvor det er muligt at rette et keyword til
   * FIXME: Denne funktion skal gerne, på en eller anden måde, kunne vurdere om der er valgt et dokument/section på forhånd
   *        som denne post skal knyttes til.
   *        Det er vigtigt, at strukturen for hvordan det løses på, er den samme for alle de andre URL'er.
   */
  async postKeywordPage(req, res) {
    const Expert = new User(req);
    const dataArray = await Promise.all([
      Expert.getThisGroupData(),               // dataArray[0]
      Expert.getThisUserData(),                // dataArray[1]
    ]);
    const data = { group: dataArray[0], user: dataArray[1] };
    this.ejs = path.join(`${this.root}/www/views/postKeyword.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HERs
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output: Et keyword
   */
  async viewKeywordPage(req, res) {
    const K = new Keyword(req);
    const dataArray = await Promise.all([
      K.getThisGroupData(),               // dataArray[0]
      K.getThisUserData(),                // dataArray[1]
      K.getThis(),                        // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], document: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/viewKeyword.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO: Mangler EJS
  /* Formål: BESKRIV EJS FORMÅL HER
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output: En form der giver brugeren mulighed for at opdatere et keyword
   */
  async putKeywordPage(req, res) {
    const K = new Keyword(req);
    const dataArray = await Promise.all([
      K.getThisGroupData(),               // dataArray[0]
      K.getThisUserData(),                // dataArray[1]
      K.getThis(),                        // dataArray[2]
    ]);
    const data = { group: dataArray[0], user: dataArray[1], keyword: dataArray[2] };
    this.ejs = path.join(`${this.root}/www/views/putKeyword.ejs`);
    res.render(this.ejs, { data });
  }
}

module.exports = {
  ViewController,
};
