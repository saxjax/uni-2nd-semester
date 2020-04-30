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

  /* Formål: At kunne oprette den givne model i databasen ud fra posted data fra en form.
             Der bliver desuden automatisk oprettet de forskellige dependencies/foreign keys som objektet tilhører.
   * Input : Object som indeholder reference ID'er og array af Keywords.
   * Output: True hvis queren inserter, ellers false hvis der sker en fejl.
   */

  /* INPUT OBJECT:
     idLinks{
       idDocument: `123-abc-fff`,
       idSection: `345-efg-fff`,
       idQuiz: `542-gds-fff`,
       idQuizQuestion: `653-asd-fff`,
     }

     INPUT ARRAY:
     keywordArray  ["Kylling","Abe","Bille"]
  */

  async insertToDatabase(idLinks, keywordArray) {
    this.createKeywords(keywordArray);
    this.createKeywordLinks(idLinks, keywordArray);
    console.log(idLinks);
    /* try {
      this.createKeywords(keywordArray);
       //linkIDSToKeywords();
      throw new Error(`Keyword er IKKE implementeret som sit eget selvstændige objekt med selvstændig tabel!`);
    }
    catch (error) {
      console.log(error);
      return false;
    }
    return true; */
  }

  /* Formål: At oprette reference ID'er mellem input keywords og input ID'er i keyword_link tabellen.
   * Input : Object af ID'er og array af Keywords
   * Output: N/A
   */
  async createKeywordLinks(idLinks, keywordArray) {
    const keywordIdArray = await this.makeKeywordIdArray(keywordArray);
    const idDocument = idLinks.idDocument === undefined ? `` : idLinks.idDocument;
    const idSection = idLinks.idSection === undefined ? `` : idLinks.idSection;
    const idQuiz = idLinks.Quiz === undefined ? `` : idLinks.Quiz;
    const idQuizQuestion = idLinks.idQuizQuestion === undefined ? `` : idLinks.idQuizQuestion;

    let keywordIdInsertString;
    let keywordLinkExist;

    keywordIdArray.forEach(async (idKeyword) =>  {
      try {
        keywordLinkExist = await this.query(`CUSTOM`, `SELECT * FROM keyword_link WHERE`
                                        + ` ID_DOCUMENT = "${idDocument}"`
                                        + ` AND ID_SECTION = "${idSection}"`
                                        + ` AND ID_QUIZ = "${idQuiz}"`
                                        + ` AND ID_QUIZ_QUESTION = "${idQuizQuestion}"`
                                        + ` AND ID_KEYWORD = "${idKeyword}"`);
      }
      catch (error) {
        console.log(`Could not select rows from keyword links table ERROR: ${error}`);
      }
      if (keywordLinkExist.length === 0) {
        keywordIdInsertString = `("${idDocument}","${idSection}","${idQuiz}","${idQuizQuestion}","${idKeyword}")`;
        try {
          await this.query(`CUSTOM`, `INSERT INTO keyword_link (ID_DOCUMENT,ID_SECTION,ID_QUIZ,ID_QUIZ_QUESTION,ID_KEYWORD) VALUES ${keywordIdInsertString}`);
        }
        catch (error) {
          console.log(`Could not insert keyword links to database ERROR: ${error}`);
        }
      }
    });
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

  async makeKeywordIdArray(keywordArray) {
    const queryString = this.makeKeywordQueryString(keywordArray);
    let queryResult;
    try {
      queryResult = await this.query(`CUSTOM`, `SELECT * FROM ${this.table} WHERE KEYWORD in (${queryString}) ORDER BY KEYWORD`);
    }
    catch (error) {
      console.log(`Could not select keywords from database ERROR: ${error}`);
    }

    const keywordIdArray = [];
    for (let i = 0; i < queryResult.length; i++) {
      keywordIdArray.push(queryResult[i].ID_KEYWORD);
    }
    return keywordIdArray;
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
