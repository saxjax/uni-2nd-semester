/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

class KeywordLink extends Model {
  /* Alle keywordLinkType/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super(req);
    this.elementType = `keyword_link`;
    this.table = `${this.keywordLinkTable}`;

    this.idKeyword = req.idKeyword === undefined ? `` : req.idKeyword;
    this.idDocument = req.idDocument === undefined ? `` : req.idDocument;
    this.idSection = req.idSection === undefined ? `` : req.idSection;
    this.idEvaluation = req.idEvaluation === undefined ? `` : req.idEvaluation;
    this.idQuizQuestion = req.idQuizQuestion === undefined ? `` : req.idQuizQuestion;
    this.idFlashcard = req.idFlashcard === undefined ? `` : req.idFlashcard;
  }
}

module.exports = {
  KeywordLink,
};
