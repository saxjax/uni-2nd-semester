/* eslint no-console: off */

const { Keyword } = require(`../Document/Keyword.js`);
const keyw = new Keyword();

class ParseSql {
  constructor() {
    // this.doc = new Document();
    this.mydata = [];
    this.keywords = [];
    this.teaser = ``;
    this.promiseArray = [];
  }

  async parser(data) {
    for (let i = 0; i < data.length; i++) {
      // console.log(data[i].elementtype);
      switch (data[i].elementtype) {
        case `section`:       this.promiseArray.push(this.parseSection(data[i]));   break;
        case `quiz`:          this.promiseArray.push(this.parseQuiz(data[i]));      break;
        case `quiz_question`: this.mydata.push(this.parseQuizQuestion(data[i]));    break;
        case `flashcard`:     this.promiseArray.push(this.parseFlashcard(data[i])); break;
        default:                                                                    break;
      }
    }
    // console.log(`parsed`);
    // console.log(this.mydata);
    try {
      await Promise.all(this.promiseArray);
    }
    catch (e) {
      console.log(e.message);
    }
    return this.mydata;
  }

  parseKeywordsFromSql(keywords) {
    const myKeywords = [];
    for (let i = 0; i < keywords.length; i++) {
      myKeywords.push(keywords[i].keyword);
    }
    return myKeywords;
  }

  async parseSection(data) {
    this.keywords = await keyw.getKeywordsForSection(data.iddocument_section);
    this.keywords = this.parseKeywordsFromSql(this.keywords);
    if (data.section_teaser === null) {
      this.teaser = data.section_content.slice(0, 200);
    }
    else {
      this.teaser = data.section_teaser;
    }
    this.mydata.push({
      elementtype: `${data.elementtype}`,
      iddocument: `${data.iddocument}`,
      iddocument_section: `${data.iddocument_section}`,
      section_number: `${data.section_number}`,
      title: `${data.section_title}`,
      content: `${data.section_content}`,
      teaser: `${this.teaser}`,
      keywords: `${this.keywords}`,
    });
  }

  async parseQuiz(data) {
    this.keywords = await keyw.getKeywordsForEvaluation(data.iddocument_section);
    this.keywords = this.parseKeywordsFromSql(this.keywords);

    this.mydata.push({
      elementtype: `${data.elementtype}`,
      idquiz: `${data.idquiz}`,
      iddocument: `${data.iddocument}`,
      title: `${data.section_title}`,
      keywords: `${this.keywords}`,
    });
  }

  parseQuizQuestion(data) {
    return {
      idquestion: `${data.idquiz_question}`,
      idquiz: `${data.idquiz}`,
      question: `${data.question}`,
      answer1: `${data.answer1}`,
      answer2: `${data.answer2}`,
      answer3: `${data.answer3}`,
      answer4: `${data.answer4}`,
      correctness: `${data.correct_answer}`,
    };
  }

  async parseFlashcard(data) {
    // this.keywords = await keyw.getKeywordsForEvaluation(data.idflashcard);
    // this.keywords = parseKeywordsFromSql(keywords);
    // this.mydata.push({
    // elementtype : `${data.elementtype}`,
    // iddocument : `${data.iddocument}`,
    // title : `${data.title}`,
    // entity: `${data.content}`,
    // definition: [`${data.answer1}`,`${data.answer2}`,`${data.answer3}`,`${data.answer4}`],
    // correctness: `${data.correctness}`
    // keywords: `${keywords}`,
    // })
  }
}

module.exports = {
  ParseSql,
};
