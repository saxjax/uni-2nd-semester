/* eslint no-console: off */

/* ParseSql er en hjælpeklasse til Database.js.
 * ParseSql parser den SQL, som vi får leveret af databasen til et format, som frontend kan forstå
 * Klassen skal kunne parse alle former for input.
 * Hvis inputtypen er ukendt, så skal den dermed blot sende data videre med en warning om at elementtypen ikke er kendt.
 */
class ParseSql {
  constructor(elementtype) {
    this.parsedData = [];
    this.elementtype = elementtype;
  }

  /* Formål: Dette er tiltænkt som den overordnede funktion, som bliver kaldt fra Database.js
   * Input:  Et array af data - kan godt modtage forskellige elementtyper i samme array
   * Output: Et array af data, som er parset/oversat fra databasesprog til frontendsprog eller et tomt array, hvis data er tom.
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
          case `user`:          this.parsedData.push(this.parseUser(data[i]));         break;
          default:
            this.parsedData.push(data[i]);
            console.warn(`WARNING: Elementtype "${data[i].elementtype}" is not defined. Parsing skipped!`);
            break;
        }
      }
    }
    else {
      this.parsedData = data;
    }
    return this.parsedData;
  }

  /* Formål: At parse Section-data
   * Input:  Et dataobjekt af typen "section" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseSection(data) {
    let teaser = ``;
    if (data.section_teaser === null) {
      teaser = data.section_content.slice(0, 200);
    }
    else {
      teaser = data.section_teaser;
    }
    return {
      elementtype: `${data.elementtype}`,
      idDocument: `${data.iddocument}`,
      idSection: `${data.iddocument_section}`,
      sectionNumber: data.section_number,
      title: `${data.section_title}`,
      content: `${data.section_content}`,
      teaser: `${teaser}`,
      keywords: undefined,
    };
  }

  /* Formål: At parse Quiz-data
   * Input:  Et dataobjekt af typen "quiz" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseQuiz(data) {
    return {
      elementtype: `${data.elementtype}`,
      idQuiz: `${data.idquiz}`,
      idDocument: `${data.iddocument}`,
      idDocumentSection: `${data.iddocument_section}`,
      title: `${data.section_title}`,
      keywords: undefined,
    };
  }

  /* Formål: At parse QuizQuestion-data
   * Input:  Et dataobjekt af typen "quiz_question" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseQuizQuestion(data) {
    return {
      idQuestion: `${data.idquiz_question}`,
      idQuiz: `${data.idquiz}`,
      question: `${data.question}`,
      answer1: `${data.answer1}`,
      answer2: `${data.answer2}`,
      answer3: `${data.answer3}`,
      answer4: `${data.answer4}`,
      correctness: `${data.correct_answer}`,
    };
  }

  /* Formål: At parse Flashcard-data
   * Input:  Et dataobjekt af typen "flashcard" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseFlashcard(data) {
    console.warn(`WARNING: Elementtype oprettet, men parser metode IKKE oprettet!`);
    return data;
  }

  /* Formål: At parse Keyword-data
   * Input:  Et dataobjekt af typen "keyword" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseKeyword(data) {
    console.warn(`WARNING: Elementtype oprettet, men parser metode IKKE oprettet!`);
    return data;
  }

  /* Formål: At parse User-data
   * Input:  Et dataobjekt af typen "user" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseUser(data) {
    console.warn(`WARNING: Elementtype oprettet, men parser metode IKKE oprettet!`);
    return data;
  }
}

module.exports = {
  ParseSql,
};
