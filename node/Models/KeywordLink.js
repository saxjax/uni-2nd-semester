/* eslint no-console: off */

// const { Model } = require(`./AbstractClasses/Model.js`);

class KeywordLink {
  constructor({
    idKeyword = ``, idDocument = ``, idSection = ``, idQuiz = ``, idQuizQuestion = ``, idFlashcard = ``,
  } = {}) {
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
