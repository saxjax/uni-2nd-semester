/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

class KeywordLink extends Model {
  constructor(req) {
    super(req);
    this.elementType = `keyword_link`;
    this.table = `keyword_link`;

    this.idKeyword = req.idKeyword === undefined ? `` : req.idKeyword;
    this.idDocument = req.idDocument === undefined ? `` : req.idDocument;
    this.idSection = req.idSection === undefined ? `` : req.idSection;
    this.idQuiz = req.idQuiz === undefined ? `` : req.idQuiz;
    this.idQuizQuestion = req.idQuizQuestion === undefined ? `` : req.idQuizQuestion;
    this.idFlashcard = req.idFlashcard === undefined ? `` : req.idFlashcard;
  }
}

module.exports = {
  KeywordLink,
};
