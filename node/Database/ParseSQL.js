/* eslint no-console: off */

/* ParseSql er en hjælpeklasse til Database.js.
 * ParseSql parser den SQL, som vi får leveret af databasen til et format, som frontend kan forstå
 * Klassen skal kunne parse alle former for input.
 * Hvis inputtypen er ukendt, så skal den dermed blot sende data videre med en warning om at elementtypen ikke er kendt.
 */
class ParseSql {
  constructor() {
    this.parsedData = [];
  }

  /* Formål: Dette er tiltænkt som den overordnede funktion, som bliver kaldt fra Database.js
   * Input:  Et array af data - kan godt modtage forskellige elementtyper i samme array
   * Output: Et array af data, som er parset/oversat fra databasesprog til frontendsprog
   */
  parse(data) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        switch (data[i].elementtype) {
          case `section`:       this.parsedData.push(this.parseSection(data[i]));      break;
          case `quiz`:          this.parsedData.push(this.parseQuiz(data[i]));         break;
          case `quiz_question`: this.parsedData.push(this.parseQuizQuestion(data[i])); break;
          case `flashcard`:     this.parsedData.push(this.parseFlashcard(data[i]));    break;
          case `keyword`:       this.parsedData.push(this.parseKeyword(data[i]));      break;
          default:
            this.parsedData.push(data[i]);
            console.warn(`WARNING: Elementtype "${data[i].elementtype}" is not defined. Parsing skipped!`);
            break;
        }
      }
    }
    else {
      this.parsedData.push(this.returnEmptyMultiobject());
    }
    return this.parsedData;
  }

  // parseKeywordsFromSql(keywords) {
  //   const myKeywords = [];
  //   for (let i = 0; i < keywords.length; i++) {
  //     myKeywords.push(keywords[i].keyword);
  //   }
  //   return myKeywords;
  // }

  /* Formål: At parse Section-data
   * Input:  Et dataobjekt af typen "section"
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseSection(data) {
    let teaser = ``;
    // const keyw = new Keyword();
    // this.keywords = await keyw.getKeywordsForSection(data.iddocument_section);
    // this.keywords = this.parseKeywordsFromSql(this.keywords);
    if (data.section_teaser === null) {
      teaser = data.section_content.slice(0, 200);
    }
    else {
      teaser = data.section_teaser;
    }
    return {
      elementtype: `${data.elementtype}`,
      iddocument: `${data.iddocument}`,
      iddocument_section: `${data.iddocument_section}`,
      section_number: data.section_number,
      title: `${data.section_title}`,
      content: `${data.section_content}`,
      teaser: `${teaser}`,
      keywords: undefined,
    };
  }

  /* Formål: At parse Quiz-data
   * Input:  Et dataobjekt af typen "quiz"
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseQuiz(data) {
    // const keyw = new Keyword();
    // this.keywords = await keyw.getKeywordsForEvaluation(data.iddocument_section);
    // this.keywords = this.parseKeywordsFromSql(this.keywords);

    return {
      elementtype: `${data.elementtype}`,
      idquiz: `${data.idquiz}`,
      iddocument: `${data.iddocument}`,
      title: `${data.section_title}`,
      keywords: undefined,
    };
  }

  /* Formål: At parse QuizQuestion-data
   * Input:  Et dataobjekt af typen "quiz_question"
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
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

  /* Formål: At parse Flashcard-data
   * Input:  Et dataobjekt af typen "flashcard"
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseFlashcard(data) {
    return data;
  }

  /* Formål: At parse Keyword-data
   * Input:  Et dataobjekt af typen "keyword"
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseKeyword(data) {
    return data;
  }


  returnEmptyMultiobject() {
    return {
      elementtype: `Not set`,
      iddocument: `00000000-00000-0000-0000-000000000000`,
      iddocument_section: `00000000-00000-0000-0000-000000000000`,
      idquiz: `00000000-00000-0000-0000-000000000000`,
      idflashcard: `00000000-00000-0000-0000-000000000000`,
      idquestion: `00000000-00000-0000-0000-000000000000`,
      section_number: `0`,
      title: `Not set`,
      content: `Not set`,
      teaser: `Not set`,
      keywords: `Not set`,
      question: `Not set`,
      answer1: `Not set`,
      answer2: `Not set`,
      answer3: `Not set`,
      answer4: `Not set`,
      correctness: `0000`,
    };
  }
}

module.exports = {
  ParseSql,
};
