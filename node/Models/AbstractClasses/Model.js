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
  /* Alle "modelnavn"Type/Col og Table er hentet fra ParseSql! */
  constructor() {
    super();
    this.idColumnGroup = `${this.groupCol}`;
    this.idColumnUser = `${this.userCol}`;
  }

  /* Formål: Opretter et unikt UUID som hentes fra databasen.
   *         Dette gøres for at sikre at der altid bruges unikke ID'er.
   * Input : Intet.
   * Output: En string med et UUID.
   */
  async getUuid() {
    const uuidArr = await this.query(`CUSTOM`, `SELECT UUID() AS UUID`);
    return uuidArr[0].UUID;
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

    let valid = false;
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
  async getThis(choice = `*`) {
    let queryData = await this.query(`SELECT ${choice}`, `${this.idColumnName} = "${this.idQuery}"`)
      .then((result) => result)
      .catch((error) => error);

    if (this.elementType === `${this.documentType}` // et check for om objektet skal hente keywords
      || this.elementType === `${this.sectionType}`
      || this.elementType === `${this.evaluationType}`
      || this.elementType === `${this.quizQuestionType}`) {
      queryData = await this.getKeywordsInObject(queryData);
    }

    return queryData;
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
    this.table = `${this.groupTable}`;
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
    this.table = `${this.userTable}`;
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
  async getAllElementsOfType(elemType) {
    const trueObjectTable = this.table;
    const choiceTable = this.parseElementTypesTable(elemType);
    this.table = choiceTable;
    let queryData = await this.query(`SELECT *`, `${this.idColumnName} = "${this.idQuery}"`)
      .then((result) => {
        this.table = trueObjectTable;
        return result;
      })
      .catch((error) => {
        console.warn(`\n\nDet givne tabelnavn er højst sandsynligt forkert angivet i parseElementTypesTable!\n\n`);
        this.table = trueObjectTable;
        return error;
      });

    if (elemType === `${this.documentType}` // et check for om objektet skal hente keywords
      || elemType === `${this.sectionType}`
      || elemType === `${this.evaluationType}`
      || elemType === `${this.quizQuestionType}`) {
      queryData = this.getKeywordsInObject(queryData);
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
      case `${this.documentType}`:     return `${this.documentTable}`;
      case `${this.flashcardType}`:    return `${this.flashcardTable}`;
      case `${this.groupType}`:        return `${this.groupTable}`;
      case `${this.keywordType}`:      return `${this.keywordLinkTable}`;
      case `${this.evaluationType}`:   return `${this.evaluationTable}`;
      case `${this.quizQuestionType}`: return `${this.quizQuestionTable}`;
      case `${this.sectionType}`:      return `${this.sectionTable}`;
      case `${this.userType}`:         return `${this.userTable}`;
      default: throw new Error(`WARNING: Element Type not implemented in parseElementTypesTable in Model`);
    }
  }

  /* Formål: At få den MySQL kolonne der svarer til det objekt der søges
   * Input : @choice som indeholder en string med navnet på et objekt med keywords
   * Output: Det valgte objekts tilsvarende ID_kolonne
   */
  getChoiceColName(choice) {
    switch (choice) {
      case `${this.documentType}`: return `${this.documentCol}`;
      case `${this.sectionType}`: return `${this.sectionCol}`;
      case `${this.evaluationType}`: return `${this.evaluationCol}`;
      case `${this.quizQuestionType}`: return `${this.quizQuestionCol}`;
      default: throw new Error(`WARNING: Kolonne ikke korrekt angivet i getChoiceColName`);
    }
  }

  /* Formål: At få alle de keywords som er i nogle objekter på den mest effektive måde (aka. 1 databasekald)
   *         Ved at gøre dette automatisk "bagved" sikres det at keywords altid er tilgængelige.
   * Input : @object er det queryobjekt der kommer fra databasen med 0 til flere arrays af objekter
   * Output: Et array af objekter som har fået et array af keywords-objekter (med keyword og idKeyword) på hver eneste objekt
   */
  async getKeywordsInObject(object) {
    try {
      if (this.idColumnName === `${this.userCol}`) { // Keywords knyttes ikke til users, så en user kan ikke få alle sine keywords som det står nu.
        return object;
      }
      const objectCopy = object;
      const choiceColName = this.getChoiceColName(object[0].elementType);
      const keywords = await this.query(`CUSTOM`, `SELECT ${this.keywordLinkTable}.${this.keywordCol}, ${this.KKeywordCol}, ${choiceColName} `
                                      + `FROM ${this.keywordLinkTable} `
                                      + `INNER JOIN ${this.keywordTable} ON ${this.keywordLinkTable}.${this.keywordCol} = ${this.keywordTable}.${this.keywordCol} `
                                      + `WHERE ${this.keywordLinkTable}.${this.idColumnName} = "${this.idQuery}"`);

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

  /* Formål: Bruges i objectCopy.find funktionen til at korrekt søge efter det valgte objekt.
   *         Hvis denne ikke er der, kan objektet ikke finde sit eget id (da MySQL og JS har inkompatibel syntaks)
   *         Denne måde at gøre det på, vidner om at koden her burde være blevet bygget op anderledes.
   * Input : @choice er det ID_kolonnenavn som er queryObjekternes primære kolonne.
   * Output: ID_Kolonnenavnet omskrevet til camelCase
   */
  getColInCamelCase(choice) {
    switch (choice) {
      case `${this.documentCol}`: return `idDocument`;
      case `${this.sectionCol}`: return `idSection`;
      case `${this.evaluationCol}`: return `idEvaluation`;
      case `${this.quizQuestionCol}`: return `idQuizQuestion`;
      default: throw new Error(`WARNING: kolonnenavn er ikke angivet i getColInCamelCase i Model`);
    }
  }
}

module.exports = {
  Model,
};
