/* eslint no-console: off */

const mysql = require(`mysql`);
const SqlString = require(`sqlstring`);
const main = require(`../../../main`);
const { ParseSql } = require(`./ParseSQL`);

/* Database objektet stiller alle manipulationer af databasen til raadighed for modeller med tilhorende database tabeller.
 * Databasen er designet efter et REST princip, som betyder at databasen skal kunne:
 * get    (dvs. faa allerede gemte data fra databasen)
 * post   (dvs. oprette nye elementer i databasen)
 * put    (dvs. manipulere med data i databasen)
 * delete (dvs. slette elementer i databasen)
 *
 * Alle modeller der extender Databasen skal oprette et tilsvarende this.table der henviser til modellens tilhorende tabel.
 */

class Database {
  /* Formål: konstruere forbindelse til databasen og øger genbrugelighed af koden.
   *         Giver desuden oversigt over alle de værdier som en given model skal huske at oversskrive.
   *         Alle variable efter mellemrummet skal overskrives af en model. Variablene over mellemrummet skal ikke.
   *         De givne variable bruges til at lave testcases.
   * Input : Non
   * Output: Extender alle disse variable til modellerne.
   */
  constructor() {
    this.database = `p2`;
    this.dbConfig = {
      host: `213.32.247.201`,
      user: `ADMIN`,
      port: `3306`,
      password: `DGzU+w9tkW9Ms&j_7-Ec+u@26Wz?P*5L`, // fs.readFileSync(` ./node/Models/AbstractClasses/password.txt`, `utf8`), // `./node/Models/AbstractClasses/password.txt `, `utf8`),
      database: this.database,
    };
    this.connect = mysql.createConnection(this.dbConfig);

    this.table = `database`;
    this.elementType = `test`;
    this.idColumnName = `ID_DATABASE`;

    this.debug = main.settings.debug;
  }

  /* Formål: Naar der sker fejl ved brug af querymetoden vil denne metode give den nodvendige information med det samme.
   *         Desuden fungere dette som dokumentation af Database klassen som helhed.
   * Input:  -
   * Output: Metoden har som (primaer) sideeffect information om hvordan querymetoden bruges.
             Metoden outputter true, saa den kan testes i tests/backend/Database/test.Class.js
   */
  info() {
    if (this.debug) {
      console.log(`INFORMATION\n`
      + `\nEn query tager et "choice" som sit forste variabel, og "data" som sin anden variabel\n`
      + `\nFoRSTE PARAMETER kan vaere:\n`
      + `SELECT "navn paa column" (for at get kun den column)\n`
      + `eller SELECT "navn paa column", "navn paa column", etc. (for at faa flere columns komma separeret.)`
      + `INSERT (for at oprette/post ny data til databasen)\n`
      + `UPDATE (for at modificere/opdatere/put data der er i databasen)\n`
      + `DELETE (for at slette en row data)\n`
      + `CUSTOM (for at skrive den raa SQL streng)\n`
      + `\nDATA PARAMETER skal vaere paa: columnNavn = variabelNavn\n`
      + `Disse data har forskellige seperatorer der kan modificere querien\n`
      + `Ved et SELECT kan man give fra 1 til tabellens storrelse.\n`
      + `Datapunkterne i et SELECT kan indledels/seperares: AND, OR eller NOT, der burde vaere selvforklarende\n`
      + `Ved et INSERT skal man give mindst 1, omend tabellen kan have nogle data der skal gives ved oprettelse\n`
      + `Datapunkterne i et INSERT skal separeres med AND, og maa ikke have duplikerede column inserts\n`
      + `Ved et UPDATE skal man give mindst 2 sepereret af et WHERE.\n`
      + `De forste vaerdier angiver hvad der skal aendres TIL fra de tilsvarende col = var paa hojre side af WHERE\n`
      + `Datapunkterne i et UPDATE skal seperares med et WHERE (og maksimalt et).\n`
      + `Ved et DELETE skal man give mindst 1, hvor det fastsaetter hvilken row der slettes\n`
      + `Ved et CUSTOM definere man hele SQL strengen saadan som det skal staa i mysql\n\n`);
    }
    // For test purposes
    return true;
  }

  // FIXME:skriv et eksempel på brug af funktionen.
  /* Formål: Ved at implementere en almen "query" metode, kan andre modeller inherit den, hvis blot this.table er overridet.
   *         Dette oger kode genbrug, samt sikre fornuftig testning paa tvaers af hele programmet i forhold til databasen.
   * Input:  @choice bestemmer hvilken slags SQL der søges. Kan være "SELECT *", "SELECT kolonnenavn"
   *            "INSERT", "UPDATE", "DELETE" eller "HEAD".
   *         @data er de data der queries for, og har en struktur på "kolonnenavn = "værdi" ", hvor "" omkring værdi er væsentlige
   *            Et eksempel kunne være "ID_USER = "Hans" ". For nærmere information, se info() metoden.
   * Output: Metoden outputter et array af objekter, hvor hvert objekt er en række fra MySQL databasen.
   */
  async query(choice, data) {
    this.sql = this.inputParser(choice, data);
    return new Promise((resolve, reject) => {
      this.connect.query(this.sql, (error, result) => {
        if (error) {
          reject(error);
        }
        else if (/SELECT/.test(choice)) { // Parseren er kun relevant når der hentes data fra databasen (eg. et select)
          const outputParser = new ParseSql(this.elementType);
          const parsedResult = outputParser.parseArrayOfObjects(result);
          resolve(parsedResult);
        }
        else {
          resolve(result);
        }
      });
    });
  }

  /* Input:  Metoden modtager de valg som brugeren har lavet
   *        (`HEAD`,`COLUMN_NAME`) giver os column navne retur fra databasen
   * Output: Metoden outputter en brugbar SQL streng til brug i mysql
   * Formaal: Ved at standardisere maaden der skrives SQL kan andre modeller nemmere haandtere queries.
   *         Det oger laesbarheden af koden, samtidigt med at det ikke abstrahere for meget,
   *         da det er SQL kommandoer der bruges.
   */
  inputParser(choice, data) {
    const valid = this.parserValidator(choice, data);
    let sql = ``;
    if (!valid) {
      if (this.debug) {
        this.info();
      }
      throw (new Error(`ERROR: Query ikke oprettet korrekt.\
      Se ovenover for hvor fejlen er at finde og find svaret i den givne info.\n`));
    }
    else if (/^SELECT [A-Za-z0-9*]+/.test(choice)) {
      if (data === undefined || data === ``) {
        sql = `${choice}, ELEMENT_TYPE FROM ${this.database}.${this.table}`;
      }
      else {
        sql = `${choice}, ELEMENT_TYPE FROM ${this.database}.${this.table} WHERE ${data}`;
      }
    }
    else {
      switch (choice) {
        case `INSERT`: {
          const dataArr = this.insertSplitter(data);
          sql = `INSERT INTO ${this.database}.${this.table} (${dataArr.columns}, ELEMENT_TYPE) VALUES (${dataArr.values}, "${this.elementType}")`;
          break;
        }
        case `UPDATE`:
          sql = `UPDATE ${this.database}.${this.table} SET ${data}`;
          break;
        case `DELETE`:
          sql = `DELETE FROM ${this.database}.${this.table} WHERE ${data}`;
          break;
        case `HEAD`:
          if (data === undefined || data === ``) {
            sql = `SELECT * FROM information_schema.columns WHERE table_schema = "${this.database}" AND table_name = "${this.table}"`;
          }
          else {
            sql = `SELECT ${data} FROM information_schema.columns WHERE table_schema = "${this.database}" AND table_name = "${this.table}"`;
          }
          break;
        case `CUSTOM`:
          sql = data;
          break;
        default:
          console.log(`ERROR: der blev ikke valgt\nSELECT, INSERT, UPDATE, DELETE, HEAD eller CUSTOM\n`);
      }
    }

    return sql;
  }

  /* Formaal: Ved at validere om formattet er overholdt, kan der testes om et evt. problem opstaar ved metodekaldet eller i operationerne.
   *         Dette gor debugging mere overskueligt, og sikre at dem der bruger metoden hurtigt faar respons paa metodens API.
   * Input: Metoden modtager de valg som brugeren har lavet
   * Output: Metoden outputter true hvis baade choice og data folger det fastsatte format.
             Ellers false med information om hvordan metoden bruges
   */
  parserValidator(choice, data) {
    let choiceValid = false;
    if (/^SELECT [A-Za-z0-9*]+/.test(choice)
       || /^INSERT$/.test(choice)
       || /^UPDATE$/.test(choice)
       || /^DELETE$/.test(choice)
       || /^HEAD$/.test(choice)
       || /^KEYWORD_JOIN/.test(choice)
       || /^CUSTOM$/.test(choice)) {
      choiceValid = true;
    }
    else if (this.debug) {
      console.log(`\n\nChoice variablen er sat forkert. Har du husket at det skal vaere store bogstaver? Korrekt sat Mellemrum?\n\n`);
    }

    let dataValid = false;
    const dataEmpty = (data === undefined || data === ``);
    const dataRe = /^\w+ /;
    if (/^CUSTOM$/.test(choice)) {
      dataValid = true;
    }
    else if (/^HEAD$/.test(choice)) {
      dataValid = true;
    }
    else if (/^DELETE$/.test(choice) && dataEmpty) {
      throw (new Error(`ERROR!: En hel tabel maa IKKE slettes! Husk at angiv en parameter`));
    }
    else if (/^UPDATE$/.test(choice) && data.search(`WHERE`) === -1) {
      throw (new Error(`ERROR!: En hel column maa IKKE opdateres med samme vaerdi! Husk at angiv hvilken row der skal opdateres`));
    }
    else if (dataEmpty || dataRe.test(data)) {
      dataValid = true;
    }
    else if (this.debug) {
      console.log(`\n\nData variablen er sat forkert. \
                   Har du husket at der skal vaere mellemrum mellem = tegnet og de forskellige operatorer?\
                   anforselstegn "" omkring strings?\n\n`);
    }
    return choiceValid && dataValid;
  }

  /* Formål: Ved at opsplitte col = val i et objekt, undgaas det at der skal bruges to forskellige syntakser
   *         mellem INSERT kontra de andre SELECT, DELETE og UPDATE.
   * Input : faar data parameteren fra et INSERT query
             @data en streng bestående af 'col = "val" AND col = "val" AND col = "val" AND ... etc.'
   * Output: Returnere et JSON objekt, hvor dataene er udsplittet i columns og deres vaerdier.
   */
  insertSplitter(data) {
    let copyData = data;
    const dataArr = { columns: ``, values: `` }; // Det objekt der indeholder de opsplittede værdier.
    let newWord;                                // Henter det første ord i strengen, inklusiv specialtegn, i første felt af arrayet (de andre er index, input og evt. groups)
    let newWordWithSpaceLength;                 // Dette bruges til at forkorte strengen, hvor mellemrummet huskes.
    let wordSwitcher = `nextWordIsCol`;         // sørger for at sikre om det næste ord er en kolonne eller en værdi. Det første er altid et kolonnenavn

    for (let i = 0; i < data.length; i += newWordWithSpaceLength) {
      // Først scannes det første ord i strengen og ordets længde plus et mellemrum udregnes til når det skal slices fra.
      [newWord] = /[^\s]+/.exec(copyData);  // Scanner alle tegn indtil næste mellemrum
      newWordWithSpaceLength = parseInt(newWord.length + 1);

      // Dernæst går rækkefølgen og operationerne alt efter ordet, eksempelvis col -> equals -> val -> val -> val -> AND -> ... -> done
      if (wordSwitcher === `nextWordIsCol`) {
        dataArr.columns += newWord;
        wordSwitcher = `nextWordIsEquals`;
      }
      else if (wordSwitcher === `nextWordIsEquals`) {
        wordSwitcher = `nextWordIsFirstVal`;
      }
      else if (wordSwitcher === `nextWordIsFirstVal`) {
        dataArr.values += newWord; // Den første værdi skal ikke have et mellemrum før sig (mens alle andre skal)
        wordSwitcher = `nextWordIsAndOrValOrDone`;
      }
      else if (wordSwitcher === `nextWordIsAndOrValOrDone` && newWord === `AND`) {
        dataArr.columns += `, `;         // Her sikres en komma separering, da et "AND" antyder en ny col = "val" funktion
        dataArr.values += `, `;
        wordSwitcher = `nextWordIsCol`;
      }
      else if (wordSwitcher === `nextWordIsAndOrValOrDone` && newWord.length > 0) {
        dataArr.values += ` `; // Her sikres de nødvendige mellemrum, efter det første ord
        dataArr.values += newWord;
        wordSwitcher = `nextWordIsAndOrValOrDone`;
      }
      else if (wordSwitcher === `nextWordIsAndOrValOrDone` && newWord === ``) {
        // done
      }
      else {
        console.log(`Error: Something went wrong in Insert Splitter`);
      }
      copyData = copyData.slice(newWordWithSpaceLength, copyData.length); // her "slices" ordet plus et mellemrum fra copydata, så det næste ord står forrest, klar til scanning
    }

    // Alle værdier i values escapes, for at undgå SQL injection
    for (let i = 0; i < dataArr.values.length; i++) {
      dataArr[i] = SqlString.escape(dataArr[i]);
    }

    return dataArr;
  }
}


module.exports = {
  Database,
};
