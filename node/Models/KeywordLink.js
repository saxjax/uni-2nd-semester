/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

class KeywordLink extends Model {
  constructor(req, {
    idKeyword = ``, idDocument = ``, idSection = ``, idQuiz = ``, idQuizQuestion = ``, idFlashcard = ``,
  } = {}) {
    super(req);
    this.elementType = `keyword_link`;
    this.table = `keyword_link`;

    this.idKeyword = idKeyword;
    this.idDocument = idDocument;
    this.idSection = idSection;
    this.idQuiz = idQuiz;
    this.idQuizQuestion = idQuizQuestion;
    this.idFlashcard = idFlashcard;
  }
}

module.exports = {
  KeywordLink,
};
