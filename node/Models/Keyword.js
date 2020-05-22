/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);
const { KeywordLink } = require(`./KeywordLink`);
const SqlString = require(`sqlstring`);

/* Keyword er et nøglebegreb som knyttes an til andre klasse.
 * Keyword kan knyttes til Document, Section og Evaluation.
 */

class Keyword extends Model {
  /* Alle keywordType/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super(req);
    this.elementType = `${this.keywordType}`;
    this.table = `${this.keywordTable}`;
    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `${this.keywordCol}`;
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
  // FIXME: Future works: lav check om createkeywords og createKeywordLinks har oprettet det de skal i databasen og return true
  async insertToDatabase(idLinks, keywordArray) {
    if (keywordArray.length > 0) {
      let keywordArrayUpper = this.makeArrayUppercaseAndEscape(keywordArray);
      keywordArrayUpper = this.removeDuplicates(keywordArrayUpper);
      await this.createKeywords(keywordArrayUpper);
      await this.createKeywordLinks(idLinks, keywordArrayUpper);
    }
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
      case `${this.documentType}`:
        idCollumn = `${this.documentCol}`;
        break;
      case `${this.sectionType}`:
        idCollumn = `${this.sectionCol}`;
        break;
      case `${this.evaluationType}`:
        idCollumn = `${this.evaluationCol}`;
        break;
      case `${this.quizQuestionType}`:
        idCollumn = `${this.quizQuestionCol}`;
        break;
      case `${this.flashcardType}`:
        idCollumn = `${this.flashcardCol}`;
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
    const idKeyword =  await this.query(`SELECT *`, `${this.KKeywordCol} = ${keyword}`);
    const DocumentsIdData =  await this.query(`CUSTOM`, `SELECT ${idCollumn} `
                                            + `FROM ${this.keywordLinkTable} `
                                            + `WHERE ${this.keywordCol} = "${idKeyword[0].idKeyword}" `
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
                                      + ` ${this.documentCol} = "${keywordLink.idDocument}"`
                                      + ` AND ${this.sectionCol} = "${keywordLink.idSection}"`
                                      + ` AND ${this.evaluationCol} = "${keywordLink.idEvaluation}"`
                                      + ` AND ${this.quizQuestionCol} = "${keywordLink.idQuizQuestion}"`
                                      + ` AND ${this.flashcardCol} = "${keywordLink.idFlashcard}"`
                                      + ` AND ${this.keywordCol} = "${idKeyword}"`);
    return keywordLinkExist;
  }


  /* Formål: Opretter en tupel i SQLdatabasen med refference id'erne for et givent keyword
   * Input : KeywordLink Object med et keyword
   * Output: N/A
   */
  async insertKeywordLink(keywordLink, idKeyword) {
    const keywordIdInsertString = `("${keywordLink.idDocument}","${keywordLink.idSection}","${keywordLink.idEvaluation}","${keywordLink.idQuizQuestion}","${idKeyword}","${keywordLink.idFlashcard}")`;
    await this.query(`CUSTOM`, `INSERT INTO ${keywordLink.table} (${this.documentCol},${this.sectionCol},${this.evaluationCol},${this.quizQuestionCol},${this.keywordCol},${this.flashcardCol}) VALUES ${keywordIdInsertString}`);
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
      await this.query(`CUSTOM`, `INSERT INTO ${this.table} (${this.KKeywordCol}) VALUES ${insertString}`);
    }
  }

  /* Formål: Opretter et array af idKeyword som matcher ordene i et array af keywords.
   * Input : Array af keywords
   * Output: Array af idKeyword
   */
  async makeKeywordIdArray(keywordArray) {
    const queryString = this.makeKeywordQueryString(keywordArray);
    const queryResult = await this.query(`CUSTOM`, `SELECT * FROM ${this.table} WHERE ${this.KKeywordCol} in (${queryString}) ORDER BY ${this.KKeywordCol}`);

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
    const queryResult =  await this.query(`CUSTOM`, `SELECT * FROM ${this.table} WHERE ${this.KKeywordCol} in (${queryString}) ORDER BY ${this.KKeywordCol}`);

    const existingKeywords = [];
    for (let i = 0; i < queryResult.length; i++) {
      existingKeywords.push(SqlString.escape(queryResult[i].KEYWORD));
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
        queryString += `(${keywordArray[i]})`;
      }
      else {
        queryString += `(${keywordArray[i]}),`;
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
        queryString += `${keywordArray[i]}`;
      }
      else {
        queryString += `${keywordArray[i]},`;
      }
    }
    return queryString;
  }

  /* Formål: At escape alle keywords så der ikke kan foregå sql injection
   * Input : @keywordArray er et array af de keywords der skal postes som er lavet til UpperCase
   * Output: Et sql escaped, uppercase array af keywords
   */
  makeArrayUppercaseAndEscape(keywordArray) {
    const uppercaseKeywordArray = [];
    keywordArray.forEach((word) => {
      const Upperword = SqlString.escape(word);
      uppercaseKeywordArray.push(Upperword.toUpperCase());
    });
    return uppercaseKeywordArray;
  }

  /* Formål: At fjerne duplicates, så der altid kun er èt keyword i tabellen
   * Input : @keywordArray er et array af de keywords der skal postes som er lavet til UpperCase
   * Output: Et array af keywords, hvor alle er unikke.
   */
  removeDuplicates(keywordArray) {
    const uniqueKeywordArray = [...new Set(keywordArray)];
    return uniqueKeywordArray;
  }
}
module.exports = {
  Keyword,
};
