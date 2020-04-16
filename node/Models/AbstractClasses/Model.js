/* eslint no-console: off */
const { Database } = require(`./Database.js`);

/* UNDER CONSTRUCTION */

class Model extends Database {
  /* UNDER CONSTRUCTION */
  /* Denne abstrakte klasse skal defineres ud fra hvad der samler de forskellige evalueringsmetoder
   * Mangler design for hvad den kan tilføje af funktionalitet. Kræver diskussion.
   */
  constructor() {
    super();
    this.idColumnGroup = `ID_USER_GROUP`;
  }

  validateMethodChoice() {
    const imValid = true;
    return imValid;
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
        console.warn(`\n\nDet givne tabelnavn er højst sandsynligt forkert angivet!\n\n`);
        this.table = parentTable;
        return error;
      });
  }

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
