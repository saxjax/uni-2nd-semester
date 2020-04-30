/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

/* FIXME: UNDER CONSTRUCTION */

class Keyword extends Model {
  constructor(req) {
    super(req);
    this.elementType = `keyword`;
    this.table = `keyword`;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      // this.idDocument?
      // this.idSection?
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `ID_KEYWORD`;
          this.idQuery      = req.params.idQuery;
          break;
        case `POST`:
          // none yet
          break;
        default: break;
      }
    }
  }

  // TODO: Objektet eksistere formelt set ikke, da det ikke er sin egen tabel.
  /* Formål: At kunne oprette den givne model i databasen ud fra posted data fra en form.
             Der bliver desuden automatisk oprettet de forskellige dependencies/foreign keys som objektet tilhører.
   * Input : Et objekt oprettet med et request med postdata i body samt user/group data i session
   * Output: True hvis queren inserter, ellers false hvis der sker en fejl.
   */

  /* INPUT:
  idLinks[
    ID_DOCUMENT       : ``,
    ID_SECTION        : ``,
    ID_QUIZ           : ``,
    ID_QUIZ_QUESTION  : ``,
  ]

  keywordArray  ["","",""]
  */

  async insertToDatabase(idLinks, keywordArray) {
    try {
      this.createKeywords(keywordArray);
      /* linkIDSToKeywords(); */
      /*
      await this.query(`ID_USER_GROUP = "${this.idGroup}" `
                 + `AND ID_USER = "${this.idUser}"`);
      */
      throw new Error(`Keyword er IKKE implementeret som sit eget selvstændige objekt med selvstændig tabel!`);
    }
    catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  /* Formål: Oprette Keywords som ikke eksisterer i databasen.
   * Input : Array af Keywords
   * Output: N/A
   */
  async createKeywords(keywordArray) {
    let queryString = keywordArray.sort();
    queryString = this.makeKeywordQueryString(keywordArray);
    const existingKeywords = await this.getExistingKeywords(queryString);

    const insertArray = keywordArray.filter((n) => !existingKeywords.includes(n)); // Subtract existing keywords from input to determine if it needs to be inserted.
    if (insertArray.length > 0) {
      const insertString = this.makeKeywordInsertString(insertArray);
      try {
        await this.query(`CUSTOM`, `INSERT INTO ${this.table} (KEYWORD) VALUES ${insertString}`);
      }
      catch (error) {
        console.log(`Could not insert keywords into table ERROR: ${error}`);
      }
    }
  }

  /* Formål: Finde hvilke keywords fra et input array som allerede eksisterer i databasen.
   * Input : Array af Keywords
   * Output: Array af eksisterende Keywords
   */
  async getExistingKeywords(queryString) {
    let queryResult;
    try {
      queryResult = await this.query(`CUSTOM`, `SELECT * FROM ${this.table} WHERE KEYWORD in (${queryString}) ORDER BY KEYWORD`);
    }
    catch (error) {
      console.log(`Could not select keywords from database ERROR: ${error}`);
    }

    const existingKeywords = [];
    for (let i = 0; i < queryResult.length; i++) {
      existingKeywords.push(queryResult[i].KEYWORD);
    }
    return existingKeywords;
  }

  /* Formål: Oprette en string til SQL SELECT af keywords.
   * Input : Array af Keywords
   * Output: N/A
   */
  makeKeywordInsertString(keywordArray) {
    let queryString = ``;
    for (let i = 0; i < keywordArray.length; i++) {
      if (i === keywordArray.length - 1) {
        queryString += `("${keywordArray[i]}")`;
      }
      else {
        queryString += `("${keywordArray[i]}"),`;
      }
    }
    return queryString;
  }

  /* Formål: Oprette en string til SQL INSERT af keywords.
   * Input : Array af Keywords
   * Output: N/A
   */
  makeKeywordQueryString(keywordArray) {
    let queryString = ``;
    for (let i = 0; i < keywordArray.length; i++) {
      if (i === keywordArray.length - 1) {
        queryString += `"${keywordArray[i]}"`;
      }
      else {
        queryString += `"${keywordArray[i]}",`;
      }
    }
    return queryString;
  }
}
module.exports = {
  Keyword,
};
