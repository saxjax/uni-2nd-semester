/* eslint no-console: off */

/* ParseSql er en hjælpeklasse til Database.js.
 * ParseSql parser den SQL, som vi får leveret af databasen til et format, som frontend kan forstå
 * Klassen skal kunne parse alle former for input fra databasen, og sikre at JavaScript siden
 * af programmet stemmer overens med MySQL siden
 */

class ParseSql {
  constructor() {
    this.parsedData = [];
  }

  /* Formål: Dette er tiltænkt som den overordnede funktion, som bliver kaldt fra Database.js
   * Input:  Et array af data - kan godt modtage forskellige elementTyper i samme array eller et tomt array
   * Output: Hvis der modtages et tomt array er det stadig en valid query. Der returneres så blot en tom RowDataPacket
   *         Et array af data, som er parset/oversat fra databasesprog til frontendsprog eller et tomt array, hvis data er tom.
   */
  parseArrayOfObjects(data) {
    if (!Array.isArray(data)) { // giver en fejl hvis data ikke er et array
      throw new Error(`Data sendt til parseren er ikke et array, og kommer derfor ikke fra Database Modulet`);
    }
    if (data.length === 0) { // returnere en tom RowDataPacket hvis data er et tomt array (se Output)
      return [{ RowDataPacket: {} }];
    }
    for (let i = 0; i < data.length; i++) { // Looper igennem "data" og parser alle RowDataPacket til camelCase
      switch (data[i].ELEMENT_TYPE) {
        case `test`:             this.parsedData.push(this.parseTest(data[i]));            break;
        case `user_group`:       this.parsedData.push(this.parseGroup(data[i]));           break;
        case `user`:             this.parsedData.push(this.parseUser(data[i]));            break;
        case `document`:         this.parsedData.push(this.parseDocument(data[i]));        break;
        case `section`:          this.parsedData.push(this.parseSection(data[i]));         break;
        case `quiz`:             this.parsedData.push(this.parseQuiz(data[i]));            break;
        case `quiz_question`:    this.parsedData.push(this.parseQuizQuestion(data[i]));    break;
        case `quiz_result`:      this.parsedData.push(this.parseQuizResult(data[i]));      break;
        case `flashcard`:        this.parsedData.push(this.parseFlashcard(data[i]));       break;
        case `flashcard_result`: this.parsedData.push(this.parseFlashcardResult(data[i])); break;
        case `keyword`:          this.parsedData.push(this.parseKeyword(data[i]));         break;
        case `keyword_link`:          this.parsedData.push(this.parseKeywordLink(data[i]));         break;


        default: throw new Error(`elementType er IKKE oprettet i Parseren!`);
      }
    }
    return this.parsedData;
  }

  /* Formål: At have en funktion der returnere testdata, når database modulet testes via Tape.
   * Input:  Et dataobjekt af typen "test" fra parse metoden.
   * Output: Et uparset objekt, der blot bruges til at se om ELEMENT_TYPE bliver korrekt parset.
   */
  parseTest(data) {
    return data;
  }

  /* Formål: At parse Group-data
   * Input:  Et dataobjekt af typen "Group" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseGroup(data) {
    return {
      elementType: `${data.ELEMENT_TYPE}`,
      idGroup: `${data.ID_USER_GROUP}`,
      name: `${data.NAME}`,
    };
  }

  /* Formål: At parse User-data
   * Input:  Et dataobjekt af typen "user" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseUser(data) {
    return {
      elementType: `${data.ELEMENT_TYPE}`,
      idUser: `${data.ID_USER}`,
      idGroup: `${data.ID_USER_GROUP}`,
      username: `${data.USER_NAME}`,
      // password: `${data.PASSWORD}`, // password parses ikke, da det kan være en mulig sikkerhedsbrist
      firstName: `${data.FIRST_NAME}`,
      lastName: `${data.LAST_NAME}`,
      email: `${data.EMAIL}`,
      studySubject: `${data.STUDY_SUBJECT}`,
      semester: `${data.SEMESTER}`,
      university: `${data.UNIVERSITY}`,
    };
  }

  /* TODO: */
  /* Formål: At parse Document-data
   * Input:  Et dataobjekt af typen "document" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseDocument(data) {
    return {
      elementType: `${data.ELEMENT_TYPE}`,
      idUser: `${data.ID_USER}`,
      idGroup: `${data.ID_USER_GROUP}`,
      idDocument: `${data.ID_DOCUMENT}`,
      title: `${data.TITLE}`,
    };
  }

  /* Formål: At parse Section-data
   * Input:  Et dataobjekt af typen "section" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseSection(data) {
    let teaser = ``;
    if (data.SECTION_TEASER === null) { // opretter en teaser hvis der ikke er en i forvejen
      teaser = data.SECTION_CONTENT.slice(0, 200);
    }
    else {
      teaser = data.SECTION_TEASER;
    }
    return {
      elementType: `${data.ELEMENT_TYPE}`,
      idDocument: `${data.ID_DOCUMENT}`,
      idSection: `${data.ID_DOCUMENT_SECTION}`,
      idUser: `${data.ID_USER}`,
      idGroup: `${data.ID_USER_GROUP}`,
      number: `${data.SECTION_NUMBER}`,
      title: `${data.SECTION_TITLE}`,
      content: `${data.SECTION_CONTENT}`,
      teaser,
      keywords: `${data.KEYWORDS}`,
    };
  }

  // TODO: keywords er undefined
  /* Formål: At parse Quiz-data
   * Input:  Et dataobjekt af typen "quiz" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseQuiz(data) {
    return {
      elementType: `${data.ELEMENT_TYPE}`,
      idQuiz: `${data.ID_QUIZ}`,
      idDocument: `${data.ID_DOCUMENT}`,
      idSection: `${data.ID_DOCUMENT_SECTION}`,
      title: `${data.QUIZ_TITLE}`,
      keywords: undefined,
    };
  }

  /* Formål: At parse QuizQuestion-data
   * Input:  Et dataobjekt af typen "quiz_question" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseQuizQuestion(data) {
    return {
      idQuizQuestion: `${data.ID_QUIZ_QUESTION}`,
      idQuiz: `${data.ID_QUIZ}`,
      question: `${data.QUESTION}`,
      answer1: `${data.ANSWER_1}`,
      answer2: `${data.ANSWER_2}`,
      answer3: `${data.ANSWER_3}`,
      answer4: `${data.ANSWER_4}`,
      correctness: `${data.CORRECT_ANSWER}`,
    };
  }

  /* Formål: At parse Quiz-result
   * Input:  Et dataobjekt af typen "quiz_result" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseQuizResult(data) {
    console.warn(`WARNING: elementType oprettet, men parser metode IKKE oprettet!`);
    return data;
  }

  /* Formål: At parse Flashcard-data
   * Input:  Et dataobjekt af typen "flashcard" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseFlashcard(data) {
    return {
      elementType: `${data.ELEMENT_TYPE}`,
      idFlashcard: `${data.ID_FLASHCARD}`,
      idUser: `${data.ID_USER}`,
      idDocument: `${data.ID_DOCUMENT}`,
      idSection: `${data.ID_DOCUMENT_SECTION}`,

      concept: `${data.CONCEPT}`,
      definition: `${data.DEFINITION}`,
      correctness: `${data.CORRECT_ANSWER}`,
    };
  }

  /* Formål: At parse Flashcard-result data
   * Input:  Et dataobjekt af typen "flashcaard_result" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseFlashcardResult(data) {
    console.warn(`WARNING: elementType oprettet, men parser metode IKKE oprettet!`);
    return data;
  }

  /* Formål: At parse Keyword-data
   * Input:  Et dataobjekt af typen "keyword" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseKeyword(data) {
    return {
      idKeyword: `${data.ID_KEYWORD}`,
      keyword: `${data.KEYWORD}`,
      elementType: `${data.ELEMENT_TYPE}`,
    };
  }


  parseKeywordLink(data) {
    return {
      idKeywordLink: `${data.ID_KEYWORD_LINK}`,
      idKeyword: `${data.ID_KEYWORD}`,
      idQuiz: `${data.ID_QUIZ}`,
      idQuizQuestion: `${data.ID_QUIZ_QUESTION}`,
      idDocument: `${data.ID_DOCUMENT}`,
      idSection: `${data.ID_DOCUMENT_SECTION}`,
      elementType: `${data.ELEMENT_TYPE}`,

    };
  }
}


module.exports = {
  ParseSql,
};
