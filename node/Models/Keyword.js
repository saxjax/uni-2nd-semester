/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);
const { KeywordLink } = require(`./KeywordLink`);
const { P } = require(`./AbstractClasses/ParseSQL`);

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
       idEvaluation: `542-gds-fff`,
       idQuizQuestion: `653-asd-fff`,
     }

     INPUT ARRAY:
     keywordArray  ["Kylling","Abe","Bille"]
  */
  // FIXME: lav check om createkeywords og createKeywordLinks har oprettet det de skal i databasen og return true
  async insertToDatabase(idLinks, keywordArray) {
    const keywordArrayUpper = this.makeArrayUppercase(keywordArray);
    await this.createKeywords(keywordArrayUpper);
    await this.createKeywordLinks(idLinks, keywordArrayUpper);
  }

  /* Formål: At oprette reference ID'er mellem input keywords og input ID'er i ${keywordLink.table} tabellen.
   * Input : Object af ID'er og array af Keywords
   * Output: N/A
   */
  async createKeywordLinks(idLinks, keywordArray) {
    const keywordLink = new KeywordLink(idLinks);
    const keywordIdArray = await this.makeKeywordIdArray(keywordArray);
    let keywordLinkExist;

    keywordIdArray.forEach(async (idKeyword) =>  {
      keywordLinkExist = await this.checkIfKeywordLinkExist(keywordLink, idKeyword);

      if (keywordLinkExist.length === 0) {
        await this.insertKeywordLink(keywordLink, idKeyword);
      }
    });
  }

  /* Formål: Hent Array af id'er som linker til keyword knyttet til en bestemt elementtype
   * Input : Et keyword og en elementType
   * Output: Et array af id'er
   */
  async getRefIdKeyword(keyword, elementType) {
    let idCollumn = ``;
    switch (elementType) {
      case `document`:
        idCollumn = `ID_DOCUMENT`;
        break;
      case `section`:
        idCollumn = `ID_DOCUMENT_SECTION`;
        break;
      case `evaluation`:
        idCollumn = `ID_EVALUATION`;
        break;
      case `quiz_question`:
        idCollumn = `ID_QUIZ_QUESTION`;
        break;
      case `flashcard`:
        idCollumn = `ID_FLASHCARD`;
        break;
      default:
        break;
    }
    return this.getIdFromCollumn(keyword, idCollumn);
  }


  /* Formål: Hent Array af id'er som linker til et keyword
   * Input : Et keyword og en elementType
   * Output: Et array af id'er
   */
  async getIdFromCollumn(keyword, idCollumn) {
    const idKeyword =  await this.query(`SELECT *`, `KEYWORD = "${keyword}"`);
    const DocumentsIdData =  await this.query(`CUSTOM`, `SELECT ${idCollumn} `
                                            + `FROM keyword_link `
                                            + `WHERE ID_KEYWORD = "${idKeyword[0].idKeyword}" `
                                            + `AND ${idCollumn} IS NOT NULL `
                                            + `AND ${idCollumn} != "" `
                                            + `GROUP BY ${idCollumn}`);
    const DocumentsIdArrray = [];
    DocumentsIdData.forEach((element) => {
      DocumentsIdArrray.push(element[idCollumn]);
    });
    return DocumentsIdArrray;
  }

  /* Formål: Checker om der eksistere en tupel i databasen med præcis samme data som vi ønsker at oprette
   * Input : KeywordLink Object med et keyword
   * Output: De tupler fra SQLdatabasen som indeholder præcis samme data som input parametrene giver.
   */
  async checkIfKeywordLinkExist(keywordLink, idKeyword) {
    const keywordLinkExist = await this.query(`CUSTOM`, `SELECT * FROM ${keywordLink.table} WHERE`
                                      + ` ID_DOCUMENT = "${keywordLink.idDocument}"`
                                      + ` AND ID_DOCUMENT_SECTION = "${keywordLink.idSection}"`
                                      + ` AND ID_EVALUATION = "${keywordLink.idEvaluation}"`
                                      + ` AND ID_QUIZ_QUESTION = "${keywordLink.idQuizQuestion}"`
                                      + ` AND ID_FLASHCARD = "${keywordLink.idFlashcard}"`
                                      + ` AND ID_KEYWORD = "${idKeyword}"`);
    return keywordLinkExist;
  }


  /* Formål: Opretter en tupel i SQLdatabasen med refference id'erne for et givent keyword
   * Input : KeywordLink Object med et keyword
   * Output: N/A
   */
  async insertKeywordLink(keywordLink, idKeyword) {
    const keywordIdInsertString = `("${keywordLink.idDocument}","${keywordLink.idSection}","${keywordLink.idEvaluation}","${keywordLink.idQuizQuestion}","${idKeyword}","${keywordLink.idFlashcard}")`;
    await this.query(`CUSTOM`, `INSERT INTO ${keywordLink.table} (ID_DOCUMENT,ID_DOCUMENT_SECTION,ID_EVALUATION,ID_QUIZ_QUESTION,ID_KEYWORD,ID_FLASHCARD) VALUES ${keywordIdInsertString}`);
  }


  /* Formål: Oprette Keywords som ikke eksisterer i databasen.
   * Input : Array af Keywords
   * Output: N/A
   */
  async createKeywords(keywordArray) {
    let queryString = ``;
    queryString = this.makeKeywordQueryString(keywordArray);
    const existingKeywords = await this.getExistingKeywords(queryString);

    const insertArray = keywordArray.filter((n) => !existingKeywords.includes(n)); // Subtract existing keywords from input to determine if it needs to be inserted.
    if (insertArray.length > 0) {
      const insertString = this.makeKeywordInsertString(insertArray);
      await this.query(`CUSTOM`, `INSERT INTO ${this.table} (KEYWORD) VALUES ${insertString}`);
    }
  }

  /* Formål: Opretter et array af idKeyword som matcher ordene i et array af keywords.
   * Input : Array af keywords
   * Output: Array af idKeyword
   */
  async makeKeywordIdArray(keywordArray) {
    const queryString = this.makeKeywordQueryString(keywordArray);
    const queryResult = await this.query(`CUSTOM`, `SELECT * FROM ${this.table} WHERE KEYWORD in (${queryString}) ORDER BY KEYWORD`);

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
    const queryResult =  await this.query(`CUSTOM`, `SELECT * FROM ${this.table} WHERE KEYWORD in (${queryString}) ORDER BY KEYWORD`);

    const existingKeywords = [];
    for (let i = 0; i < queryResult.length; i++) {
      existingKeywords.push(queryResult[i].KEYWORD);
    }
    return existingKeywords;
  }

  /* Formål: Oprette en string til SQL INSERT ud fra et array af keywords.
   * Input : Array af Keywords
   * Output: String til brug i VALUES clause i INSERT  statement
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

  /* Formål: Oprette en string til SQL SELECT ud fra et array af keywords.
   * Input : Array af Keywords
   * Output: String til brug i WHERE clause i et SELECT statement
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

  makeArrayUppercase(keywordArray) {
    const uppercaseKeywordArray = [];
    keywordArray.forEach((word) => {
      uppercaseKeywordArray.push(word.toUpperCase());
    });
    return uppercaseKeywordArray;
  }
}
module.exports = {
  Keyword,
};
