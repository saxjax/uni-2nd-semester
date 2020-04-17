/* eslint-disable guard-for-in */
/* eslint no-console: off */
const path = require(`path`);
const { Document } = require(`../Models/Document`);
const { Section } = require(`../Models/Section`);
const { Quiz } = require(`../Models/Quiz`);
const { Flashcard } = require(`../Models/Flashcard`);
const { Group } = require(`../Models/Group`);
const { User } = require(`../Models/User`);

/* ViewController er den controller som præsentere alle de "views" som brugeren kan se i et grupperum.
 * ViewControllerens metoder vil dermed alle sammen hente og vise et ejs dokument, hvor der medsendes data.
 * ViewController vil dermed være den simpleste form, da der ikke bør være nogen form for logik, men alt andet logik bør
 * henvises til eksempelvis RedirectController (hvis der skal tjekkes for redirects) mv.
 */

class ViewController {
  constructor() {
    this.name = `ViewController`;
    this.root = __dirname.slice(0, -(`node/Controllers`.length));
    this.ejs = ``;
  }

  /* Non-Object Views */

  /* Formål: Et overblik til brugeren om den gruppe vedkommende er en del af, samt hvilke muligheder brugeren har.
   * Input : Et request der har oprettet en userId og groupId.
   * Output: Startsiden af hjemmesiden, som skal give et overblik for User.
   */
  async homePage(req, res) {
    const U = new User(req);
    const data = {
      user: await U.getThis(),
      req,
    };
    this.ejs = path.join(`${this.root}/www/views/home.ejs`);
    res.render(this.ejs, { data });
  }

  // TODO:
  /* Formål: En side der angiver information om hjemmesiden.
   *         Denne side skal være tilgængelig fra alle sider af hjemmesiden.
   * Input : Non.
   * Output: Visning af information om hjemmesiden, uden man behøver være User.
   * FIXME: Implementation af denne funktionalitet kræver højst sandsynligt en ændring i Servermetoden "noSessionNoAccess"
   *         da den blokere for alt adgang til hjemmesiden, hvis man ikke er logget ind og har valgt gruppe, hvor denne
   *         vil være en undtagelse. Implementer gerne så denne kan være "en af flere" undtagelser.
   */
  // async aboutPage(req, res) {

  // }

  /* Document Views TODO: */

  // TODO:
  /* Formål: At vise brugeren alle de dokumenter som er tilgængelige for vedkommende på siden.
   * Input : En session med groupId
   * Output: En liste af de dokumenter som er lagt op i gruppen.
   */
  // async viewDocumentRecipientPage(req, res) {
  //   const G = new Group(req);
  // }

  // TODO:
  /* Formål: At vise brugeren for alle de dokumenter de personligt har lagt op på siden.
   * Input : En session med userId og groupId
   * Output: En liste af dokumenter som brugeren har lagt op.
   */
  // async viewDocumentExpertPage(req, res) {
  //   const U = new User(req);
  // }

  // TODO:
  /* Formål: At gøre det muligt for brugeren at oprette et dokument med tekst input (ikke upload!)
   * Input : En session med userId og groupId
   * Output: En visning af en form som brugeren kan bruge til at oprette et dokument.
   */
  // async insertDocumentPage(req, res) {
  //   const Doc = new Document(req);
  // }

  // TODO:
  /* Formål: At vise brugeren for en enkelt requested side.
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async viewDocumentPage(req, res) {
  //   const Doc = new Document(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async deleteDocumentPage(req, res) {
  //   const Doc = new Document(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async updateDocumentPage(req, res) {
  //   const Doc = new Document(req);
  // }

  /* Section Views TODO: */

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output: En liste af de sections som er lagt op i gruppen.
   */
  // async viewSectionRecipientPage(req, res) {
  //   const Recipient = new Group(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output:
   */
  // async viewSectionExpertPage(req, res) {
  //   const Expert = new User(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId samt et queryId fra params
   * Output:
   */
  // async viewSectionDocumentPage(req, res) {
  //   const Doc = new Document(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output:
   * FIXME: Denne funktion skal gerne, på en eller anden måde, kunne vurdere om der er valgt et dokument/section på forhånd
   *        som denne insert skal knyttes til.
   *        Det er vigtigt, at strukturen for hvordan det løses på, er den samme for alle de andre URL'er.
   */
  // async insertSectionPage(req, res) {
  //   const Sec = new Section(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async viewSectionPage(req, res) {
  //   const Sec = new Section(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async deleteSectionPage(req, res) {
  //   const Sec = new Section(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async updateSectionPage(req, res) {
  //   const Sec = new Section(req);
  // }

  /* Evaluation Views TODO: */

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output:
   */
  // async viewEvaluationsRecipientPage(req, res) {
  //   const Recipient = new Group(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output:
   */
  // async viewEvaluationsExpertPage(req, res) {
  //   const Expert = new User(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId og queryId fra params
   * Output:
   */
  // async viewEvaluationsDocumentPage(req, res) {
  //   const Doc = new Document(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId og queryId fra params
   * Output:
   */
  // async viewEvaluationsSectionPage(req, res) {
  //   const Sec = new Section(req);
  // }

  /* Quiz Views TODO: */

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output:
   */
  // async viewQuizRecipientPage(req, res) {
  //   const Recipient = new Group(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output:
   */
  // async viewQuizExpertPage(req, res) {
  //   const Expert = new User(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId og queryId fra params
   * Output:
   */
  // async viewQuizDocumentPage(req, res) {
  //   const Doc = new Document(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId og queryId fra params
   * Output:
   */
  // async viewQuizSectionPage(req, res) {
  //   const Sec = new Section(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId (og muligvis document/section id?)
   * Output:
   * FIXME: Denne funktion skal gerne, på en eller anden måde, kunne vurdere om der er valgt et dokument/section på forhånd
   *        som denne insert skal knyttes til.
   *        Det er vigtigt, at strukturen for hvordan det løses på, er den samme for alle de andre URL'er.
   */
  // async insertQuizPage(req, res) {
  //   const Q = new Quiz(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async viewQuizPage(req, res) {
  //   const Q = new Quiz(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async deleteQuizPage(req, res) {
  //   const Q = new Quiz(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async updateQuizPage(req, res) {
  //   const Q = new Quiz(req);
  // }

  /* Flashcard Views TODO: */

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output:
   */
  // async viewFlashcardRecipientPage(req, res) {
  //   const Recipient = new Group(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output:
   */
  // async viewFlashcardExpertPage(req, res) {
  //   const Expert = new User(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output:
   */
  // async viewFlashcardDocumentPage(req, res) {
  //   const Doc = new Document(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output:
   */
  // async viewFlashcardSectionPage(req, res) {
  //   const Sec = new Section(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId (og muligvis document/section id?)
   * Output:
   * FIXME: Denne funktion skal gerne, på en eller anden måde, kunne vurdere om der er valgt et dokument/section på forhånd
   *        som denne insert skal knyttes til.
   *        Det er vigtigt, at strukturen for hvordan det løses på, er den samme for alle de andre URL'er.
   */
  // async insertFlashcardPage(req, res) {
  //   const F = new Flashcard(req);

  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async viewFlashcardPage(req, res) {
  //   const F = new Flashcard(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async deleteFlashcardPage(req, res) {
  //   const F = new Flashcard(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async updateFlashcardPage(req, res) {
  //   const F = new Flashcard(req);
  // }

  /* Keyword Views TODO: */

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output:
   */
  // async viewKeywordRecipientPage(req, res) {
  //   const Recipient = new Group(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId
   * Output:
   */
  // async viewKeywordExpertPage(req, res) {
  //   const Expert = new User(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId og queryId fra params
   * Output:
   */
  // async viewKeywordDocumentPage(req, res) {
  //   const Doc = new Document(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId og queryId fra params
   * Output:
   */
  // async viewKeywordSectionPage(req, res) {
  //   const Sec = new Section(req);
  // }

  // TODO:
  /* Formål:
   * Input : En session med userId og groupId (og muligvis document/section id?)
   * Output:
   * FIXME: Denne funktion skal gerne, på en eller anden måde, kunne vurdere om der er valgt et dokument/section på forhånd
   *        som denne insert skal knyttes til.
   *        Det er vigtigt, at strukturen for hvordan det løses på, er den samme for alle de andre URL'er.
   */
  // async insertKeywordPage(req, res) {
  //   const K = new Keyword(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async viewKeywordPage(req, res) {
  //   const K = new Keyword(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async deleteKeywordPage(req, res) {
  //   const K = new Keyword(req);
  // }

  // TODO:
  /* Formål:
   * Input : Et request med et queryId samt en session med userId og groupId
   * Output:
   */
  // async updateKeywordPage(req, res) {
  //   const K = new Keyword(req);
  // }

  /* Formål: Et overblik over alle de tilgængelige evalueringsværktøjer som brugeren har adgang til i sin valgte gruppe.
   * Input : Et request der har oprettet en userId og groupId.
   * Output: Viser alle tilgængelige evalueringer for en bestemt Group.
   */
  async viewEvaluationGroupPage(req, res) {
    const group = new Group(req);
    const data = {
      flashcard: await group.getAllElementsOfType(`Flashcard`),
      quiz: await group.getAllElementsOfType(`Quiz`),
    };

    this.ejs = path.join(`${this.root}/www/views/evalueringer.ejs`);
    res.render(this.ejs, { data });
  }

  /* Formål: Et overblik over alle de tilgængelige evalueringsværktøjer som brugeren har oprettet.
   * Input : Et request der har oprettet en userId og groupId.
   * Output: Viser alle tilgængelige evalueringer for en bestemt Group.
   */
  async viewEvaluationUserPage(req, res) {
    const group = new Group(req);
    const data = {
      flashcard: await group.getAllElementsOfType(`Flashcard`),
      quiz: await group.getAllElementsOfType(`Quiz`),
    };

    this.ejs = path.join(`${this.root}/www/views/evalueringer.ejs`);
    res.render(this.ejs, { data });
  }

  /* Formål: Viser indholdet af 
   * Input : Id og en type(flashcard eller quiz) (id'et er hhv idflashcard og idquiz alt efter typen)
   *         alt efter typen s� hentes quiz questions eller flashcards knyttet til det specifikke idflashcard eller idquiz.
   * Output: Viser en Quiz som en bruger kan tage.
   */
  async viewQuizPage(req, res) {
    const quiz = new Quiz(req);
    const data = {
      quiz: await quiz.getThis(),
      question: await quiz.getAllElementsOfType(`QuizQuestion`),
    }
    this.ejs = path.join(`${this.root}/www/views/viewQuiz.ejs`);
    res.render(this.ejs, { data });
  }

  /* UNDER CONSTRUCTION */
  async flashcardPage(req, res) {
    const flashcard = new Flashcard(req);
    const data = await flashcard.getFlashcard();
    this.ejs = path.join(`${this.root}/www/views/evalueringerFlashcard.ejs`);
    res.render(this.ejs, { flashcard: data });
  }

  // Formål: Viser alle tilg�ngelige sections fra databasen p� siden rapport.ejs
  // input : Non
  // output: Array af Alle tilg�ngelige sections i databasen sendes som
  //         array: afsnit til /www/views/rapport.ejs
  /* UNDER CONSTRUCTION */
  async rapportPage(req, res) {
    const group = new Group(req);
    const data = {
      section: await group.getAllElementsOfType(`Section`),
    };
    this.ejs = path.join(`${this.root}/www/views/rapport.ejs`);
    res.render(this.ejs, { data });
  }

  async sections(req, res) {
    const G = new Group(req);
    const data = await G.getAllElementsOfType(`Section`);
    console.log(data);
    res.render(path.join(`${this.root}/www/views/sections.ejs`), { sections: data });
  }

  // Formål: Viser alle tilgængelige evaluations knyttet til en bestemt section på siden rapportafsnit.ejs
  // Input : Iddocument_section
  // Output: Array af Alle evalueringer samt content fra en section tilknyttet en section med id = iddocument_section
  //         sendes som arrays: flashcards, quizzes, section til /www/views/rapportafsnit.ejs
  /* UNDER CONSTRUCTION */
  async rapportSectionPage(req, res) {
    const sec = new Section(req);
    const data = {
      flashcards: await sec.getAllFlashcards(),
      quizzes: await sec.getAllQuizzes(),
      section: await sec.getThis(),
    };
    this.ejs = path.join(`${this.root}/www/views/rapportafsnit.ejs`);
    res.render(this.ejs, { data });
  }

  /* UNDER CONSTRUCTION */
  uploadPage(req, res) {
    if (req.params.type === `evalueringer`) {
      this.ejs = path.join(`${this.root}/www/views/evalueringerUpload.ejs`);
    }
    else if (req.params.type === `rapport`) {
      this.ejs = path.join(`${this.root}/www/views/rapportUpload.ejs`);
    }
    res.render(this.ejs);
  }

  /* UNDER CONSTRUCTION */
  createQuiz(req, res) {
    this.ejs = path.join(`${this.root}/www/views/createQuiz.ejs`);
    res.render(this.ejs);
  }

  /* UNDER CONSTRUCTION */
  createFlashcard(req, res) {
    const G = new Group(req);
    const data = {
      section: G.getAllElementsOfType(`section`),
    };
    this.ejs = path.join(`${this.root}/www/views/createFlashcard.ejs`);
    res.render(this.ejs, { data });
  }
}

module.exports = {
  ViewController,
};
