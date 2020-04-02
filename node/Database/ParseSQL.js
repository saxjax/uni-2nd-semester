const { Keyword } = require(`../Document/Keyword.js`);

class ParseSql {
  constructor() {
    this.keyw = new Keyword();
    // this.doc = new Document();
    this.mydata = [];
    this.keywords = [];
    this.teaser = ``;
  }

  async parser(data) {
    for (let i = 0; i < data.length; i++) {
      // console.log(data[i].elementtype);
      switch (data[i].elementtype) {
        case `section`:
          this.keywords = await this.keyw.getKeywordsForSection(data[i].iddocument_section);
          this.keywords = this.parseKeywordsFromSql(this.keywords);
          if (data[i].section_teaser === null) {
            this.teaser = data[i].section_content.slice(0, 200);
          }
          else {
            this.teaser = data[i].section_teaser;
          }
          this.mydata.push({
            elementtype: `${data[i].elementtype}`,
            iddocument: `${data[i].iddocument}`,
            iddocument_section: `${data[i].iddocument_section}`,
            section_number: `${data[i].section_number}`,
            title: `${data[i].section_title}`,
            content: `${data[i].section_content}`,
            teaser: `${this.teaser}`,
            keywords: `${this.keywords}`,
          });
          break;

        case `quiz`:
          this.keywords = await this.keyw.getKeywordsForEvaluation(data[i].iddocument_section);
          this.keywords = this.parseKeywordsFromSql(this.keywords);

          this.mydata.push({
            elementtype: `${data[i].elementtype}`,
            idquiz: `${data[i].idquiz}`,
            iddocument: `${data[i].iddocument}`,
            title: `${data[i].section_title}`,
            keywords: `${this.keywords}`,
          });
          break;

        case `quiz_question`:
          this.mydata.push({
            idquestion: `${data[i].idquiz_question}`,
            idquiz: `${data[i].idquiz}`,
            question: `${data[i].question}`,
            answer1: `${data[i].answer1}`,
            answer2: `${data[i].answer2}`,
            answer3: `${data[i].answer3}`,
            answer4: `${data[i].answer4}`,
            correctness: `${data[i].correct_answer}`,
          });
          break;

        case `flashcard`:
          // this.keywords = await this.keyw.getKeywordsForEvaluation(data[i].idflashcard);
          // this.keywords = parseKeywordsFromSql(keywords);
          // this.mydata.push({
          // elementtype : `${data[i].elementtype}`,
          // iddocument : `${data[i].iddocument}`,
          // title : `${data[i].title}`,
          // entity: `${data[i].content}`,
          // definition: [`${data[i].answer1}`,`${data[i].answer2}`,`${data[i].answer3}`,`${data[i].answer4}`],
          // correctness: `${data[i].correctness}`
          // keywords: `${keywords}`,
          // })
          break;

        default:
          break;
      }
    }
    // console.log(`parsed`);
    // console.log(this.mydata);
    return this.mydata;
  }

  parseKeywordsFromSql(keywords) {
    const myKeywords = [];
    for (let i = 0; i < keywords.length; i++) {
      myKeywords.push(keywords[i].keyword);
    }
    return myKeywords;
  }
}

module.exports = new ParseSql();
