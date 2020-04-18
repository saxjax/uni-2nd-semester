/* eslint no-console: off */
const { Database } = require(`./Database.js`);

/* Model er det objekt som virker som bindeled mellem databasen og de andre modeller
 * Model bruger databasens query funktion til at implementere generelle funktionaliteter.
 * Dette er gjort for at sikre genbrugelig kode samt at undgå fejl (såsom at glemme at query for groupId)
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
  }

  /* Formål: Alle modeller konstrueres ud fra den givne session brugeren er en del af, samt
   *         de parametre der er medsendt hvis det er et ikke-POST request (params) eller,
   *         i tilfælde af et POST request, så er objektet i den body der medsendes.
   *         Ved at validere disse er til stede et sted undgås der fejl i construction af objekterne.
   * Input : Et request
   * Output: En true værdi hvis requested har session, params(GET/UPDATE/DELETE) og/eller body(POST) ellers false.
   */
  validateMethodChoice(req) {
    let paramsMethod;
    let bodyMethod;
    if (req.method) {
      paramsMethod = (req.method.toUpperCase() === `GET`
                       || req.method.toUpperCase() === `UPDATE`
                       || req.method.toUpperCase() === `DELETE`);
      bodyMethod   = (req.method.toUpperCase() === `POST`);
    }
    else {
      return false;
    }

    let valid = ``;
    if (req.session) {
      if (paramsMethod && req.params) {
        valid = true;
      }
      else if (bodyMethod && req.body) {
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
    return this.query(`SELECT ${choice}`, `${this.idColumnName} = "${this.queryId}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  /* Formål: En almen funktion så alle objekter der knytter sig til et objekt kan hentes.
             Denne er ment som generel case til at hente FLERE objekter der knytter sig til ET objekt.
             eksempel kunne være document.getAll(`section`); for at få alle sections tilknyttet et document.
   * Input : valg af den tabel der ønskes at blive opslået i ud fra et andet objekts id.
   * Output: En liste af underobjekter som er udvalgt ud fra Id'et i det øvre objekt.
   */
  async getAllElementsOfType(choice) {
    const parentTable = this.table;
    this.table = this.parseElementTypesTable(choice);
    return this.query(`SELECT *`, `${this.idColumnName} = "${this.queryId}" AND ${this.idColumnGroup} = "${this.groupId}"`)
      .then((result) => {
        this.table = parentTable;
        return result;
      })
      .catch((error) => {
        console.warn(`\n\nDet givne tabelnavn er højst sandsynligt forkert angivet i parseElementTypesTable!\n\n`);
        this.table = parentTable;
        return error;
      });
  }

  /* Formål: Denne funktion sletter den instance af klassen som kalder denne funktion
   * Input : Et oprettet objekt skal kalde denne funktion.
   * Output: Et array der indeholder data vedrørende om objektet er slettet eller ej.
   */
  async deleteThis() {
    if (this.queryId) {
      return this.query(`DELETE`, `${this.idColumnName} = "${this.queryId}"`)
        .then((result) => result)
        .catch((error) => error);
    }
    throw new Error(`ERROR! Objectet der ønskes slettet har ikke et queryId tilknyttet!`);
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
      case `Keyword`: return `keyword`;
      case `Quiz`: return `quiz`;
      case `QuizQuestion`: return `quiz_question`;
      case `Section`: return `document_section`;
      case `User`: return `user`;
      default: throw new Error(`WARNING: Element Type not implemented in parseElementTypesTable in Model`);
    }
  }
}

module.exports = {
  Model,
};