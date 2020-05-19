/* eslint no-console: off */
const { Database } = require(`./Database.js`);

/* Model er det objekt som virker som bindeled mellem databasen og de andre modeller
 * Model bruger databasens query funktion til at implementere generelle funktionaliteter.
 * Dette er gjort for at sikre genbrugelig kode samt at undgå fejl (såsom at glemme at query for idGroup)
 *
 * Som eksempel kan tages getThis(), som gør at alle modeller kan query for deres egen information.
 * Eller deleteThis(), som gør det den siger, og til sidst getAllElementsOfType("ObjektNavn")
 * Især den sidste er relevant, da vi så kan implementere den et sted, fremfor at eksempelvis
 * Group skulle implementere mindst 5 seperate funktion for User, Document, Section, Quiz og Flashcard (mm.)
 */

class Model extends Database {
  constructor() {
    super();
    this.idColumnGroup = `ID_USER_GROUP`;
    this.idColumnUser = `ID_USER`;
  }

  /* Formål: Alle modeller konstrueres ud fra den givne session brugeren er en del af, samt
   *         de parametre der er medsendt hvis det er et ikke-POST request (params) eller,
   *         i tilfælde af et POST request, så er objektet i den body der medsendes.
   *         Ved at validere disse er til stede et sted undgås der fejl i construction af objekterne.
   * Input : Et request
   * Output: En true værdi hvis requested har session, params(GET/UPDATE/DELETE) og/eller body(POST) ellers false.
   */
  validRequest(req) {
    let methodNeedsParamsInRequest;
    let methodNeedsBodyInRequest;
    if (req.method) {
      methodNeedsParamsInRequest = (req.method.toUpperCase() === `GET`
                       || req.method.toUpperCase() === `UPDATE`
                       || req.method.toUpperCase() === `DELETE`);
      methodNeedsBodyInRequest   = (req.method.toUpperCase() === `POST`);
    }
    else {
      return false;
    }

    let valid = ``;
    if (req.session) {
      if (methodNeedsParamsInRequest && req.params) {
        valid = true;
      }
      else if (methodNeedsBodyInRequest && req.body) {
        valid = true;
      }
      else {
        console.warn(`Params (hvis get/update/delete) eller Body (hvis Post) er ikke oprettet!`);
      }
    }

    else {
      console.warn(`Session er ikke oprettet!`);
      valid = false;
    }
    return valid;
  }

  /* Formål: Mulighed for at få data der tilhører et objekt med et unikt ID.
   * Input : Et kald fra et unikt objekt, som desuden vælger hvilken kolonne der søges efter.
   * Output: En enkel værdi ud fra id og kolonne, der bruges til at konstruere objektet.
   */
  async getThis(column) {
    let choice = ``;
    if (column) {
      choice = column;
    }
    else {
      choice = `*`;
    }
    return this.query(`SELECT ${choice}`, `${this.idColumnName} = "${this.idQuery}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  /* Formål: At kunne tilgå data om den gruppe man er en del af såsom gruppens navn med videre.
   * Input : Et objekt der er oprettet med et idGroup i session
   * Output: Den row i user_group tabellen der svarer til idGroup
   * trueObjectTable variablen bruges til at gemme objektets oprindelige tabel
   * dette gøres for midlertidigt at assigne this.table til usertabellen så man kan få userdata.
   * Dette gøres så vi ikke behøver at oprette et user objekt til hvert eneste metode, da id´et allerede ligger i den pågældende session.
   */
  async getThisGroupData() {
    const trueObjectTable = this.table;
    this.table = `USER_GROUP`;
    const data = this.query(`SELECT *`, `${this.idColumnGroup} = "${this.idGroup}"`)
      .then((result) => result)
      .catch((error) => error);
    this.table = trueObjectTable;
    return data;
  }

  /* Formål: At kunne tilgå data om den user man er såsom ens username med videre.
  * Input : Et objekt der er oprettet med et idUser i session
  * Output: Den row i user tabellen der svarer til idUser
  * trueObjectTable variablen bruges til at gemme objektets oprindelige tabel
  * dette gøres for midlertidigt at assigne this.table til usertabellen så man kan få userdata.
  * Dette gøres så vi ikke behøver at oprette et user objekt til hvert eneste metode, da id´et allerede ligger i den pågældende session.
  */
  async getThisUserData() {
    const trueObjectTable = this.table;
    this.table = `USER`;
    const data = this.query(`SELECT *`, `${this.idColumnUser} = "${this.idUser}"`)
      .then((result) => result)
      .catch((error) => error);
    this.table = trueObjectTable;
    return data;
  }

  /* Formål: En almen funktion så alle objekter der knytter sig til et objekt kan hentes.
             Denne er ment som generel case til at hente FLERE objekter der knytter sig til ET objekt.
             eksempel kunne være document.getAll(`section`); for at få alle sections tilknyttet et document.
   * Input : valg af den tabel der ønskes at blive opslået i ud fra et andet objekts id.
   * Output: En liste af underobjekter som er udvalgt ud fra Id'et i det øvre objekt.
   */
  async getAllElementsOfType(choice) {
    const parentTable = this.table;
    const choiceTable = this.parseElementTypesTable(choice);
    this.table = choiceTable;
    let queryData = await this.query(`SELECT *`, `${this.idColumnName} = "${this.idQuery}" AND ${this.idColumnGroup} = "${this.idGroup}"`)
      .then((result) => {
        this.table = parentTable;
        return result;
      })
      .catch((error) => {
        console.warn(`\n\nDet givne tabelnavn er højst sandsynligt forkert angivet i parseElementTypesTable!\n\n`);
        this.table = parentTable;
        return error;
      });

    if (choice === `Document` // et check for om objektet skal hente keywords
      || choice === `Section`
      || choice === `Evaluation`
      || choice === `QuizQuestion`) {
      queryData = this.setKeywordsInObjectOfType(queryData, choice);
    }

    return queryData;
  }

  /* Formål: Denne funktion sletter den instance af klassen som kalder denne funktion
   * Input : Et oprettet objekt skal kalde denne funktion.
   * Output: Et array der indeholder data vedrørende om objektet er slettet eller ej.
   */
  async deleteThis() {
    if (this.idQuery) {
      return this.query(`DELETE`, `${this.idColumnName} = "${this.idQuery}"`)
        .then((result) => result)
        .catch((error) => error);
    }
    throw new Error(`ERROR! Objectet der ønskes slettet har ikke et idQuery tilknyttet!`);
  }

  /* Formål: Gør det muligt at skrive getAllElementsOfType("Quiz"), så vi ikke behøver huske tabel navnene.
   *         Det nemmeste ville være at oprette eksempelvis en new Quiz (og så sige Quiz.table), men da
   *         Quiz extender Model vil det skabe en rekursions fejl.
   * Input : Et valg som er en string der tilsvarer navnet på en model.
   * Output: Oversætter objektnavnet som input til det tilsvarende tabel navn.
   */
  parseElementTypesTable(choice) {
    switch (choice) {
      case `Document`: return `document`;
      case `Flashcard`: return `flashcard`;
      case `Group`: return `user_group`;
      case `Keyword`: return `keyword_link`;
      case `Evaluation`: return `evaluation`;
      case `QuizQuestion`: return `quiz_question`;
      case `Section`: return `document_section`;
      case `User`: return `user`;
      default: throw new Error(`WARNING: Element Type not implemented in parseElementTypesTable in Model`);
    }
  }

  getChoiceColName(choice) {
    switch (choice) {
      case `Document`: return `ID_DOCUMENT`;
      case `Section`: return `ID_DOCUMENT_SECTION`;
      case `Evaluation`: return `ID_EVALUATION`;
      case `QuizQuestion`: return `ID_QUIZ_QUESTION`;
      default: throw new Error(`WARNING: Kolonne ikke korrekt angivet i getChoiceColName`);
    }
  }

  async setKeywordsInObjectOfType(object, choice) {
    try {
      const objectCopy = object;
      const choiceColName = this.getChoiceColName(choice);
      const keywords = await this.query(`CUSTOM`, `SELECT keyword_link.ID_KEYWORD, KEYWORD, ${choiceColName} FROM keyword_link `
                                      + `INNER JOIN keyword ON keyword_link.ID_KEYWORD = keyword.ID_KEYWORD `
                                      + `WHERE keyword_link.${this.idColumnName} = "${this.idQuery}"`);


      for (let j = 0; j < objectCopy.length; j++) {
        objectCopy[j].keywords = [];
      }

      for (let i = 0; i < keywords.length; i++) {
        if (keywords[i][choiceColName] !== ``) {
          const objectId = keywords[i][choiceColName];
          const colToCamelCase = this.getColInCamelCase(choiceColName);
          const objectWithKeyword = objectCopy.find((owk) => owk[colToCamelCase] === objectId);
          objectWithKeyword.keywords.push({ keyword: keywords[i].KEYWORD, idKeyword: keywords[i].ID_KEYWORD });
        }
      }

      return objectCopy;
    }
    catch (error) {
      throw new Error(`Keywords blev ikke joined korrekt`);
    }
  }

  getColInCamelCase(choice) {
    switch (choice) {
      case `ID_DOCUMENT`: return `idDocument`;
      case `ID_DOCUMENT_SECTION`: return `idSection`;
      case `ID_EVALUATION`: return `idEvaluation`;
      case `ID_QUIZ_QUESTION`: return `idQuizQuestion`;
      default: throw new Error(`WARNING: kolonnenavn er ikke angivet i getColInCamelCase i Model`);
    }
  }
}

module.exports = {
  Model,
};
