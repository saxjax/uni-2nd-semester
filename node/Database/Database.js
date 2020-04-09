/* eslint no-console: off */

const mysql = require(`mysql`);
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
    this.connect = mysql.createConnection({
      host: `213.32.247.201`,
      user: `ADMIN`,
      port: `3306`,
      password: `Admin123!`,
      database: this.database,
    });

    this.table = `database`;
    this.elementtype = `test`;
    this.groupId = 0;
    this.userId = 0;
  }

  /* Formål: Naar der sker fejl ved brug af querymetoden vil denne metode give den nodvendige information med det samme.
   *         Desuden fungere dette som dokumentation af Database klassen som helhed.
   * Input:  Metoden modtager et optional texton variabel, som defaulter til true hvis den ikke medsendes.
   * Output: Metoden har som (primaer) sideeffect information om hvordan querymetoden bruges.
             Metoden outputter true, saa den kan testes i tests/backend/Database/test.Class.js
   */
  info(texton = true) {
    if (texton) {
      console.log(`INFORMATION\n`
      + `\nEn query tager et "choice" som sit forste variabel, og "data" som sin anden variabel\n`
      + `\nFoRSTE PARAMETER kan vaere:\n`
      + `SELECT * (for at get alle data)\n`
      + `eller SELECT "navn paa column" (for at get kun den column)\n`
      + `eller SELECT "navn paa column", "navn paa column", etc. (for at faa flere columns komma separeret.)`
      + `INSERT (for at oprette/post ny data til databasen)\n`
      + `UPDATE (for at modificere/opdatere/put data der er i databasen)\n`
      + `DELETE (for at slette en row data)\n`
      + `CUSTOM (for at skrive den raa SQL streng)\n`
      + `\nDATA PARAMETER skal vaere paa: columnNavn = variabelNavn\n`
      + `Disse data har forskellige seperatorer der kan modificere querien\n`
      + `Ved et SELECT kan man give fra 0 til tabellens storrelse. Vaelges 0 faar man hele den valgte tabel/column\n`
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

  /* Formål: Ved at implementere en almen "query" metode, kan andre modeller inherit den, hvis blot this.table er overridet.
   *         Dette oger kode genbrug, samt sikre fornuftig testning paa tvaers af hele programmet i forhold til databasen.
   * Input:  Metoden modtager de valg som brugeren har lavet, og gennem parser metoden, faar noget brugbar SQL,
   *         Der kan vaere et get, post, put eller delete.
   *         Metoden indtager ogsaa texton parameter, som frakobles info() kald under test af catching af errors, men ellers altid er true.
   * Output: Metoden outputter den parsede data hentet fra SQL databasen, ud fra den givne SQL streng
   */
  async query(choice, data, texton = true) {
    this.sql = this.inputParser(choice, data, texton);
    return new Promise((resolve, reject) => {
      this.connect.query(this.sql, (error, result) => {
        if (error) {
          if (texton) {
            console.log(`Here at node/Database/Database.js-data the error \n${error.code}\n
            and ${error.stack}`);
          }
          reject(error);
        }
        else {
          const outputParser = new ParseSql(this.elementtype);
          resolve(outputParser.parse(result));
        }
      });
    });
  }

  /* Input:  Metoden modtager de valg som brugeren har lavet
   *         Metoden indtager ogsaa texton parameter, som frakobles info() kald under test af catching af errors, men ellers altid er true.
   * Output: Metoden outputter en brugbar SQL streng til brug i mysql
   * Formaal: Ved at standardisere maaden der skrives SQL kan andre modeller nemmere haandtere queries.
   *         Det oger laesbarheden af koden, samtidigt med at det ikke abstrahere for meget,
   *         da det er SQL kommandoer der bruges.
   */
  inputParser(choice, data, texton = true) {
    const valid = this.parserValidator(choice, data, texton);
    let sql = ``;
    if (!valid) {
      if (texton) {
        this.info();
      }
      throw (new Error(`ERROR: Query ikke oprettet korrekt.\
      Se ovenover for hvor fejlen er at finde og find svaret i den givne info.\n`));
    }
    else if (/^SELECT [A-Za-z0-9*]+/.test(choice)) {
      if (data === undefined || data === ``) {
        sql = `${choice} FROM ${this.database}.${this.table}`;
      }
      else {
        sql = `${choice} FROM ${this.database}.${this.table} WHERE ${data}`;
      }
    }
    else {
      switch (choice) {
        case `INSERT`: {
          const dataArr = this.insertSplitter(data);
          sql = `INSERT INTO ${this.database}.${this.table} (${dataArr.columns}) VALUES (${dataArr.values})`;
          break;
        }
        case `UPDATE`:
          sql = `UPDATE ${this.database}.${this.table} SET ${data}`;
          break;
        case `DELETE`:
          sql = `DELETE FROM ${this.database}.${this.table} WHERE ${data}`;
          break;
        case `HEAD`:
          sql = `SELECT * FROM information_schema.columns WHERE table_schema = "${this.database}" AND table_name = "${this.table}"`;
          break;
        case `CUSTOM`:
          if (texton) {
            console.log(`Custom metode brugt. Se om den kan inkorperes i de andre metoder.\n`);
          }
          sql = data;
          break;
        default:
          console.log(`ERROR: der blev ikke valgt\nSELECT, INSERT, UPDATE, DELETE eller CUSTOM\n`);
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
  parserValidator(choice, data, texton = true) {
    let choiceValid = false;
    if (/^SELECT [A-Za-z0-9*]+/.test(choice)
       || /^INSERT$/.test(choice)
       || /^UPDATE$/.test(choice)
       || /^DELETE$/.test(choice)
       || /^HEAD$/.test(choice)
       || /^CUSTOM$/.test(choice)) {
      choiceValid = true;
    }
    else if (texton) {
      console.log(`\n\nChoice variablen er sat forkert. Har du husket at det skal vaere store bogstaver? Korrekt sat Mellemrum?\n\n`);
    }

    let dataValid = false;
    const dataEmpty = (data === undefined || data === ``);
    const dataRe = /^\w+ = /;
    if (/^CUSTOM$/.test(choice)) {
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
    else if (texton) {
      console.log(`\n\nData variablen er sat forkert. \
                   Har du husket at der skal vaere mellemrum mellem = tegnet og de forskellige operatorer?\
                   anforselstegn "" omkring strings?\n\n`);
    }
    return choiceValid && dataValid;
  }

  /* Formål: Ved at opsplitte col = val i et objekt, undgaas det at der skal bruges to forskellige syntakser
   *         mellem INSERT kontra de andre SELECT, DELETE og UPDATE.
   * Input : faar data parameteren fra et INSERT query
   * Output: Returnere et JSON objekt, hvor dataene er udsplittet i columns og deres vaerdier.
  */
  insertSplitter(data) {
    let done = false;
    let dataCopy = data;
    const dataArr = { columns: ``, values: `` };

    while (!done) {
      dataArr.columns += /^\w+/.exec(dataCopy);
      dataCopy = dataCopy.slice(`${/^\w+/.exec(dataCopy)} = `.length, dataCopy.length);
      dataArr.values += /"\w+"/.exec(dataCopy);
      dataCopy = dataCopy.slice(`${/"\w+"/.exec(dataCopy)} `.length, dataCopy.length);
      try {
        if (/^\w+/.exec(dataCopy)[0] === `AND`) {
          dataArr.columns += `, `;
          dataArr.values  += `, `;
          dataCopy = dataCopy.slice(`AND `.length, dataCopy.length);
        }
      }
      catch (error) {
        if (/^TypeError/.test(error) === true) {
          done = true;
        }
        else {
          console.log(`FEJL IKKE FANGET i insertSplitter!\n`);
        }
      }
    }

    return dataArr;
  }

  /* Metoden insertSplitter bliver her beskrevet mere i detaljen for dem der ikke kender saa meget til regular expressions.
           * Lokken har til formaal at opsplitte "col = var" grupper i kolonner og variable, saa de kan bruges som INSERT SQL
           * Der initialiseres en "done" variabel der returnere true naar der ikke er flere ´col = var´ grupper tilbage
           * /^[@\w+]/.exec(dataCopy) finder det forste alfanumeriske element og laegger det til column variablen --
           * -- i et JSON objekt med matchet som det forste element
           * data = data.slice "slicer" det alfanumeriske element vaek + " = " strengen, saa variablen i "col = var" konstruktionen er klar.
           * values bruger samme regular expression for at faa variablen ud af den nu forkortede data streng
           * Der tjekkes nu for, om der er en ny "col = var" ved at se om det naeste element er et AND
           * /^[@\w+]/.exec(dataCopy) returnere null hvis der IKKE er et match, hvilket giver en typefejl naar der skal ledes efter --
           * -- det forste element i /^[@\w+]/.exec(dataCopy)[0]
           * Er der det appendes der ", " for at gore det brugbart som en INSERT SQL, og "AND " slices vaek fra datasaettet
           * Er der ikke flere elementer, dvs. der er ikke flere "col = var" der skal postes, saa giver det den fornaevnte typefejl.
           * Inden der returnes true sikrer vi os at det rent faktisk er en typefejl, og ikke alt muligt andet der kunne vaere gaaet galt.
           */
}


module.exports = {
  Database,
};
