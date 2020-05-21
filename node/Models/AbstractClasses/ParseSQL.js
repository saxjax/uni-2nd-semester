/* ParseSql er en hjælpeklasse til Database.js.
 * ParseSql parser den SQL, som vi får leveret af databasen til et format, som frontend kan forstå
 * Klassen skal kunne parse alle former for input fra databasen, og sikre at JavaScript siden
 * af programmet stemmer overens med MySQL siden, som kan ses i constructoren
 */

class ParseSql {
  constructor() {
    this.parsedData = [];
    /* Tabel navnene */
    this.groupTable = `user_group`;
    this.userTable = `user`;
    this.documentTable = `document`;
    this.sectionTable = `document_section`;
    this.evaluationTable = `evaluation`;
    this.quizQuestionTable = `quiz_question`;
    this.quizResultTable = `quiz_result`;
    this.flashcardTable = `flashcard`;
    this.flashcardResultTable = `flashcard_result`;
    this.keywordTable = `keyword`;
    this.keywordLinkTable = `keyword_link`;
    this.spacedRepetitionTable = `repetition_task`;
    /* Elementtypes */
    this.groupType = `group`;
    this.userType = `user`;
    this.documentType = `document`;
    this.sectionType = `section`;
    this.evaluationType = `evaluation`;
    this.quizQuestionType = `quiz_question`;
    this.quizResultType = `quiz_result`;
    this.flashcardType = `flashcard`;
    this.flashcardResultType = `flashcard_result`;
    this.keywordType = `keyword`;
    this.keywordLinkType = `keyword_link`;
    this.spacedRepetitionType = `repetition_task`;
    /* ID kolonner der bruges alt efter hieraki */
    this.groupCol = `ID_USER_GROUP`;
    this.userCol = `ID_USER`;
    this.documentCol = `ID_DOCUMENT`;
    this.sectionCol = `ID_DOCUMENT_SECTION`;
    this.evaluationCol = `ID_EVALUATION`;
    this.quizQuestionCol = `ID_QUIZ_QUESTION`;
    this.quizResultCol = `ID_QUIZ_RESULT`;
    this.flashcardCol = `ID_FLASHCARD`;
    this.flashcardResultCol = `ID_FLASHCARD_RESULT`;
    this.keywordCol = `ID_KEYWORD`;
    this.keywordLinkCol = `ID_KEYWORD_LINK`;
    this.attemptCol = `ID_ATTEMPT`;
    /* kolonner i alle klasser */
    this.typeCol = `ELEMENT_TYPE`;
    /* Group kolonner */
    this.GNameCol = `NAME`;
    /* User kolonner */
    this.UUsernameCol = `USER_NAME`;
    this.UPasswordCol = `PASSWORD`;
    this.UFirstNameCol = `FIRST_NAME`;
    this.ULastNameCol = `LAST_NAME`;
    this.UEmailCol = `EMAIL`;
    this.UStudySubjectCol = `STUDY_SUBJECT`;
    this.USemesterCol = `SEMESTER`;
    this.UUniversityCol = `UNIVERSITY`;
    /* Document kolonner */
    this.DTitleCol = `TITLE`;
    /* Section kolonner */
    this.SContentCol = `SECTION_CONTENT`;
    this.STitleCol = `SECTION_TITLE`;
    this.STeaserCol = `SECTION_TEASER`;
    this.SNumberCol = `SECTION_NUMBER`;
    /* Evaluation kolonner */
    this.ETitleCol = `EVALUATION_TITLE`;
    /* QuizQuestion kolonner */
    this.QQQuestionCol = `QUESTION`;
    this.QQAnswersCol = `ANSWERS`;
    this.QQCorrectnessCol = `CORRECT_ANSWERS`;
    this.QQKeywordsCol = `KEYWORD`;
    /* QuizResult Kolonner */
    this.QRAttemptCol = `ID_ATTEMPT`;
    this.QRPointCol = `POINT`;
    this.QRTotalCol = `TOTAL`;
    this.QRResultCol = `RESULT`;
    this.QRCreatedDateCol = `CREATED_DATE`;
    this.QRUserAnswerCol  = `USER_ANSWER`;

    /* Flashcard Kolonner */
    /* FLASHCARD IKKE IMPLEMENTERET!
    this.FConceptCol = `CONCEPT`;
    this.FDefinitionCol = `DEFINITION`;
    this.FCorrectnessCol = `CORRECT_ANSWER`;
    */
    /* FlaschardResult kolonner */
    /* Keyword kolonner */
    this.KKeywordCol = `KEYWORD`;
    /* KeywordLink kolonner */
  }

  /* Formål: Dette er tiltænkt som den overordnede funktion, som bliver kaldt fra Database.js
   * Input:  Et array af data - kan godt modtage forskellige elementTyper i samme array eller et tomt array
   * Output: Hvis der modtages et tomt array er det stadig en valid query. Der returneres så blot en tom RowDataPacket
   *         Et array af data, som er parset/oversat fra databasesprog til frontendsprog eller et tomt array, hvis data er tom.
   */
  parseArrayOfObjects(data) {
    if (!Array.isArray(data)) { // giver en fejl hvis data ikke er et array
      throw new Error(`PARSESQL.JS_NOT_ARRAY: Data sendt til parseren er ikke et array, og kommer derfor ikke fra Database Modulet`);
    }
    if (data.length === 0) { // returnere en tom RowDataPacket hvis data er et tomt array (se Output)
      return [{ RowDataPacket: {} }];
    }
    for (let i = 0; i < data.length; i++) { // Looper igennem "data" og parser alle RowDataPacket til camelCase
      switch (data[i][this.typeCol]) {
        case `test`:             this.parsedData.push(this.parseTest(data[i]));             break;
        case `user_group`:       this.parsedData.push(this.parseGroup(data[i]));            break;
        case `user`:             this.parsedData.push(this.parseUser(data[i]));             break;
        case `document`:         this.parsedData.push(this.parseDocument(data[i]));         break;
        case `section`:          this.parsedData.push(this.parseSection(data[i]));          break;
        case `evaluation`:       this.parsedData.push(this.parseEvaluation(data[i]));       break;
        case `quiz_question`:    this.parsedData.push(this.parseQuizQuestion(data[i]));     break;
        case `quiz_result`:      this.parsedData.push(this.parseQuizResult(data[i]));       break;
        case `repetition_task`:  this.parsedData.push(this.parseQuizResult(data[i]));       break;//! !!! FIXME:der skal oprettes en parser til repetitiontask
        // case `flashcard`:        this.parsedData.push(this.parseFlashcard(data[i]));        break;
        // case `flashcard_result`: this.parsedData.push(this.parseFlashcardResult(data[i]));  break;
        case `keyword`:          this.parsedData.push(this.parseKeyword(data[i]));          break;
        case `keyword_link`:     this.parsedData.push(this.parseKeywordLink(data[i]));      break;
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
      elementType: data[this.typeCol],
      // IDs
      idGroup: data[this.groupCol],
      // data
      name: data[this.GNameCol],
    };
  }

  /* Formål: At parse User-data
   * Input:  Et dataobjekt af typen "user" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseUser(data) {
    return {
      elementType: data[this.typeCol],
      // IDs
      idUser: data[this.userCol],
      idGroup: data[this.groupCol],
      // data
      username: data[this.UUsernameCol],
      password: data[this.UPasswordCol],
      firstName: data[this.UFirstNameCol],
      lastName: data[this.ULastNameCol],
      email: data[this.UEmailCol],
      studySubject: data[this.UStudySubjectCol],
      semester: data[this.USemesterCol],
      university: data[this.UUniversityCol],
    };
  }

  /* TODO: */
  /* Formål: At parse Document-data
   * Input:  Et dataobjekt af typen "document" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseDocument(data) {
    return {
      elementType: data[this.typeCol],
      // IDs
      idGroup: data[this.groupCol],
      idUser: data[this.userCol],
      idDocument: data[this.documentCol],
      // data
      title: data[this.DTitleCol],
    };
  }

  /* Formål: At parse Section-data og at oprette en teaser hvis den ikke er gemt i databasen.
   * Input:  Et dataobjekt af typen "section" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseSection(data) {
    return {
      elementType: data[this.typeCol],
      // IDs
      idGroup: data[this.groupCol],
      idUser: data[this.userCol],
      idDocument: data[this.documentCol],
      idSection: data[this.sectionCol],
      // data
      number: data[this.SnumberCol],
      title: data[this.STitleCol],
      content: data[this.SContentCol],
      teaser: data[this.STeaserCol] || (data[this.SContentCol] ? data[this.SContentCol].slice(0, 200) : undefined), // dette gøres for at undgå at der throwes en Error, i tilfælde af at data[this.SContentCol] giver undefined (eg. man kan ikke "slice" undefined)
    };
  }

  // TODO: keywords er undefined
  /* Formål: At parse Quiz-data
   * Input:  Et dataobjekt af typen "evaluation" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseEvaluation(data) {
    return {
      elementType: data[this.typeCol],
      // IDs
      idGroup: data[this.groupCol],
      idUser: data[this.userCol],
      idDocument: data[this.documentCol],
      idSection: data[this.sectionCol],
      idEvaluation: data[this.evaluationCol],
      // data
      title: data[this.ETitleCol],
    };
  }

  /* Formål: At parse QuizQuestion-data
   * Input:  Et dataobjekt af typen "quiz_question" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   */
  parseQuizQuestion(data) {
    return {
      elementType: data[this.typeCol],
      // IDs
      idQuizQuestion: data[this.quizQuestionCol],
      idEvaluation: data[this.evaluationCol],
      // data
      question: data[this.QQQuestionCol],
      answers: data[this.QQAnswersCol].split(`;`),
      correctness: data[this.QQCorrectnessCol],
      keywords: data[this.QQKeywordsCol],
    };
  }

  /* Formål: At parse Quiz-result
   * Input:  Et dataobjekt af typen "quiz_result" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseQuizResult(data) {
    return {
      elementType: data[this.typeCol],
      // IDs
      idGroup: data[this.groupCol],
      idUser: data[this.userCol],
      idEvaluation: data[this.evaluationCol],
      idQuizResult: data[this.quizResultCol],
      idQuizQuestion: data[this.quizQuestionCol],
      // data
      attempt: data[this.QRAttemptCol],
      point: data[this.QRPointCol],
      total: data[this.QRTotalCol],
      result: data[this.QRResultCol],
      createdData: data[this.QRCreatedDateCol],
      userAnswers: data[this.QRUserAnswerCol],
    };
  }


  /* Formål: At parse Quiz-resultData specialdesignet returværdi fra SQL databasen
   * Input:  Et array som indeholder nedenstående properties
   * Output: Et parset array, som kan forståes af spacedrepetition funktionerne
   */
  parseQuizResultsForSpacedRepetition(quizResultData) {
    const result = [];
    quizResultData.forEach((quizResult) => {
      result.push({
        idQuizQuestion: quizResult.ID_QUIZ_QUESTION,
        idUser: quizResult.ID_USER,
        recentResult: quizResult.RECENT_RESULT,
        recentAttemptDate: quizResult.RECENT_ATTEMPT_DATE,
        nextRepetition: quizResult.NEXT_REPITITION,
        repetitions: quizResult.TOTAL,
        failedAttempts: quizResult.FAILED_ATTEMPTS,
        successAttempts: quizResult.SUCESS_ATTEMPTS,
      });
    });

    return result;
  }

  /* Formål: At parse Flashcard-data
   * Input:  Et dataobjekt af typen "flashcard" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  /* FLASHCARD IKKE IMPLEMENTERET!
  parseFlashcard(data) {
    return {
      elementType: data[this.typeCol],
      // IDs
      idEvaluation: data[this.evaluationCol],
      idFlashcard: data[this.flashcardCol],
      // data
      concept: data[this.FConceptCol],
      definition: data[this.FDefinitionCol],
      correctness: data[this.FCorrectnessCol],
    };
  } */

  /* Formål: At parse Flashcard-result data
   * Input:  Et dataobjekt af typen "flashcaard_result" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  /* FLASHCARD IKKE IMPLEMENTERET!
  parseFlashcardResult(data) {
    return {
      elementType: data[this.typeCol],
      // IDs
      idFlashcardResult: data[this.flashcardResultCol],
      // data
    };
  } */

  /* Formål: At parse Keyword-data
   * Input:  Et dataobjekt af typen "keyword" fra parse metoden.
   * Output: Et parset dataobjekt, som kan forståes på frontend
   * FIXME: Metoden skal udvikles
   */
  parseKeyword(data) {
    return {
      elementType: data[this.typeCol],
      // IDs
      idKeyword: data[this.keywordCol],
      // data
      keyword: data[this.KKeywordCol],
    };
  }

  parseKeywordLink(data) {
    return {
      elementType: data[this.typeCol],
      // IDs
      idGroup: data[this.groupCol],
      idDocument: data[this.documentCol],
      idSection: data[this.sectionCol],
      idEvaluation: data[this.evaluationCol],
      idQuizQuestion: data[this.quizQuestionCol],
      idFlashcard: data[this.flashcardCol],
      idKeyword: data[this.keywordCol],
      idKeywordLink: data[this.keywordLinkCol],
      // data
    };
  }
}


module.exports = {
  ParseSql,
};
