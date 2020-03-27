/* eslint no-console: off */
const mysql = require(`mysql`);

/* Database objektet stiller alle manipulationer af databasen til rådighed for modeller med tilhørende database tabeller.
 * Databasen er designet efter et REST princip, som betyder at databasen skal kunne:
 * get    (dvs. få allerede gemte data fra databasen)
 * post   (dvs. oprette nye elementer i databasen)
 * put    (dvs. manipulere med data i databasen)
 * delete (dvs. slette elementer i databasen)
 *
 * Alle modeller der extender Databasen skal oprette et tilsvarende this.table der henviser til modellens tilhørende tabel.
 */

class Database {
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
    this.choiceValgmuligheder = `SELECT {noget}/UPDATE/INSERT/DELETE & CUSTOM`;
  }
  /* Input:  Metoden modtager et optional texton variabel, som defaulter til true hvis den ikke medsendes.
   * Output: Metoden har som (primær) sideeffect information om hvordan querymetoden bruges.
             Metoden outputter true, så den kan testes i tests/backend/Database/test.Class.js
   * Formål: Når der sker fejl ved brug af querymetoden vil denne metode give den nødvendige information med det samme.
   *         Desuden fungere dette som dokumentation af Database klassen som helhed.
   */

  info(texton = true) {
    if (texton) {
      console.log(`INFORMATION\n`
      + `En query tager et "choice" som sit forste variabel, og "data" som sin anden variabel\n`
      + `En query tager et "choice" som sin forste variabel:\n`
      + `SELECT * (for at get alle data)\n`
      + `eller SELECT "navn på column" (for at get kun den column)\n`
      + `eller SELECT "navn på column", "navn på column", etc. (for at få flere columns komma separeret.)`
      + `INSERT (for at oprette/post ny data til databasen)\n`
      + `UPDATE (for at modificere/opdatere/put data der er i databasen)\n`
      + `DELETE (for at slette en row data)\n`
      + `CUSTOM (for at skrive den raa SQL streng)\n`
      + `En query tager derefter noget "data" som er på formattet: columnNavn = variabelNavn\n`
      + `Disse data har forskellige seperatorer der kan modificere querien\n`
      + `Ved et SELECT kan man give fra 0 til tabellens storrelse. Vælges 0 får man hele den valgte tabel/column\n`
      + `Datapunkterne i et SELECT kan indledels/seperares: AND, OR eller NOT, der burde være selvforklarende\n`
      + `Ved et INSERT skal man give mindst 1, omend tabellen kan have nogle data der skal gives ved oprettelse\n`
      + `Datapunkterne i et INSERT skal separeres med AND, og må ikke have duplikerede column inserts\n`
      + `Ved et UPDATE kan man kun give 2, hvor den første er hvilken værdi der skal ændres, og den anden er hvad den aendres til\n`
      + `Datapunkterne i et UPDATE skal seperares med et WHERE (og maksimalt et).\n`
      + `Ved et DELETE kan man kun give 1, hvor det fastsætter hvilken row der slettes\n`
      + `Ved et CUSTOM definere man hele SQL strengen sådan som det skal stå i mysql\n`);
    }
    // For test purposes
    return true;
  }

  /* Input:  Metoden modtager de valg som brugeren har lavet, og gennem parser metoden, får noget brugbar SQL,
   *         Der kan være et get, post, put eller delete.
   *         Metoden indtager også texton parameter, som frakobles info() kald under test af catching af errors, men ellers altid er true.
   * Output: Metoden outputter data hentet fra SQL databasen, ud fra den givne SQL streng
   * Formål: Ved at implementere en almen "query" metode, kan andre modeller inherit den, hvis blot this.table er overridet.
   *         Dette øger kode genbrug, samt sikre fornuftig testning på tværs af hele programmet i forhold til databasen.
   */
  query(choice, data, texton = true) {
    this.sql = this.parser(choice,data,texton);
    return new Promise((resolve, reject) => {
      this.connect.query(this.sql,
        (error, result, texton) => {
          if (error) {
            if (texton) {
              console.log(`Here at node/Database/Database.js-data the error \n${error.code}\n
              and ${error.stack} should be saved in the Database`);
            }
            reject(error);
          }
          else {
            resolve(result);
          }
        });
    });
  }

  /* Input:  Metoden modtager de valg som brugeren har lavet
   *         Metoden indtager også texton parameter, som frakobles info() kald under test af catching af errors, men ellers altid er true.
   * Output: Metoden outputter en brugbar SQL streng til brug i mysql
   * Formål: Ved at standardisere måden der skrives SQL kan andre modeller nemmere håndtere queries.
   *         Det øger læsbarheden af koden, samtidigt med at det ikke abstrahere for meget,
   *         da det er SQL kommandoer der bruges.
   */
  parser(choice, data, texton = true) {
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
          let columns = ``;
          let values = ``;

          /* Denne while løkke bruger regular expressions som nok kræver en forklaring:
           * Løkken har til formål at opsplitte "col = var" grupper i kolonner og variable, så de kan bruges som INSERT SQL
           * Der initialiseres en "done" variabel der returnere true når der ikke er flere ´col = var´ grupper tilbage
           * /^\w+/.exec(data) finder det første alfanumeriske element og lægger det til column variablen
           * data = data.slice "slicer" det alfanumeriske element væk + " = " strengen, så variablen i "col = var" konstruktionen er klar.
           * values bruger samme regular expression for at få variablen ud af den nu forkortede data streng
           * Der tjekkes nu for, om der er en ny "col = var" ved at se om det næste element er et AND
           * Er der det appendes der ", " for at gøre det brugbart som en INSERT SQL, og "AND " slices væk fra datasættet
           * Er der ikke flere elementer, dvs. der er ikke flere "col = var" der skal postes, så antages det her at datasættet er tomt og løkken terminere.
           */
          let done = false;
          while (!done) {
            columns += /^\w+/.exec(data);
            data = data.slice(`${/^\w+/.exec(data)} = `.length, data.length);
            values += /"\w+"/.exec(data);
            data = data.slice(`${/"\w+"/.exec(data)} `.length, data.length);

            /* NOTE: af en eller anden grund skal det være == og IKKE === . Tjek gerne op på det */
            if (/^\w+/.exec(data) === `AND`) {
              columns += `, `;
              values  += `, `;
              data = data.slice(`AND `.length, data.length);
            }
            else {
              done = true;
            }
          }

          sql = `INSERT INTO ${this.database}.${this.table} (${columns}) VALUES (${values})`;
          break;
        }
        case `UPDATE`:
          sql = `UPDATE ${this.database}.${this.table} SET ${data}`;
          break;
        case `DELETE`:
          sql = `DELETE FROM ${this.database}.${this.table} WHERE ${data}`;
          break;
        case `CUSTOM`:
          console.log(`Custom metode brugt. Se om den kan inkorperes i de andre metoder.\n`);
          sql = data;
          break;
        default:
          console.log(`ERROR: der blev ikke valgt\nSELECT, INSERT, UPDATE, DELETE eller CUSTOM\n`);
      }
    }

    return sql;
  }

  /* Input: Metoden modtager de valg som brugeren har lavet
   * Output: Metoden outputter true hvis både choice og data følger det fastsatte format. 
             Ellers false med information om hvordan metoden bruges
   * Formål: Ved at validere om formattet er overholdt, kan der testes om et evt. problem opstår ved metodekaldet eller i operationerne.
   *         Dette gør debugging mere overskueligt, og sikre at dem der bruger metoden hurtigt får respons på metodens API.
   */
  parserValidator(choice, data, texton = true) {
    let choiceValid = false;
    if (/^SELECT [A-Za-z0-9*]+/.test(choice) 
       || /^INSERT$/.test(choice)
       || /^UPDATE$/.test(choice)
       || /^DELETE$/.test(choice)
       || /^CUSTOM$/.test(choice)) {
      choiceValid = true;
    }
    else if (texton) {
      console.log(`\n\nChoice variablen er sat forkert. Har du husket at det skal være store bogstaver? Korrekt sat Mellemrum?\n\n`);
    }

    let dataValid = false;
    const dataRe = /^\w+ = /;
    if (data === undefined || data === `` || dataRe.test(data)) {
      dataValid = true;
    }
    else if (texton) {
      console.log(`\n\nData variablen er sat forkert. \
                   Har du husket at der skal være mellemrum mellem = tegnet og de forskellige operatorer?\
                   anførselstegn "" omkring strings?\n\n`);
    }
    return choiceValid && dataValid;
  }
}


module.exports = {
  Database,
};
