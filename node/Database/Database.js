/* eslint no-console: off */
const mysql = require(`mysql`);

/* Database objektet stiller alle manipulationer af databasen til rådighed for modeller (dvs. Ikke controllere!) 
 * Databasen er designet efter et REST princip, som betyder at databasen skal kunne:
 * get    (dvs. få allerede gemte data fra databasen)
 * post   (dvs. oprette nye elementer i databasen)
 * put    (dvs. manipulere med data i databasen)
 * delete (dvs. slette elementer i databasen)
 */

class Database {
  constructor() {
    this.connect = mysql.createConnection({
      host: `213.32.247.201`,
      user: `ADMIN`,
      port: `3306`,
      password: `Admin123!`,
      database: `p2`,
    });
    this.table = `database`;
  }

  info() {
    console.log(`INFORMATION\n`
    + `En query tager et "choice" som sit første variabel, og "data" som sin anden variabel\n`
    + `En query tager et "choice" som sin første variabel:\n`
    + `SELECT * (for at get alle data) eller SELECT "navn på column" (for at get kun den column)\n`
    + `INSERT (for at oprette/post ny data til databasen)\n`
    + `UPDATE (for at modificere/opdatere/put data der er i databasen)\n`
    + `DELETE (for at slette en row data)\n`
    + `En query tager derefter noget "data" som er på formattet: columnNavn = variabelNavn\n`
    + `Disse data har forskellige seperatorer der kan modificere querien\n`
    + `Ved et SELECT kan man give fra 0 til tabellens størrelse. Vælges 0 får man hele den valgte tabel/column\n`
    + `Datapunkterne i et SELECT kan indledels/seperares: AND, OR eller NOT, der burde være selvforklarende\n`
    + `Ved et INSERT skal man give mindst 1, omend tabellen kan have nogle data der skal gives ved oprettelse\n`
    + `Datapunkterne i et INSERT skal separeres med AND, og må ikke have duplikerede column inserts\n`
    + `Ved et UPDATE kan man kun give 2, hvor den første er hvilken værdi der skal ændres, og den anden er hvad den ændres til\n`
    + `Datapunkterne i et UPDATE skal seperares med et TO (og maksimalt et).\n`
    + `Ved et DELETE kan man kun give 1, hvor det fastsætter hvilken row der slettes\n`
    );
    return true;
  }

  /* Input: Metoden modtager de valg som brugeren har lavet, og gennem parser metoden, får noget brugbar SQL,
   *        Der kan være et get, post, put eller delete.
   * Output: Metoden outputter data hentet fra SQL databasen, ud fra den givne SQL streng
   * Formål: Ved at implementere en almen "query" metode, kan andre modeller inherit den
   */
  query(choice,data) {
    this.sql = this.parser(choice,data);
    return new Promise((resolve, reject) => {
      this.connect.query(this.sql,
        (error, result) => {
          if (error) {
            console.log(`Here at node/Database/Database.js-data the error \n${error.code}\n
            and ${error.stack} should be saved in the Database`);
            reject(error);
          }
          else {
            resolve(result);
          }
        });
    });
  }

  /* Input: Metoden modtager de valg som brugeren har lavet
   * Output: Metoden outputter en brugbar SQL streng til brug i mysql
   * Formål: Ved at standardisere måden der skrives SQL kan andre modeller nemmere håndtere queries.
   *         Det øger læsbarheden af koden, samtidigt med at det ikke abstrahere for meget, 
   *         da det er SQL kommandoer der bruges.
   */
  parser(choice,data) {
    const valid = this.parserValidator(choice,data);
    let sql = ``;
    if(!valid) {
        this.info();
        throw `ERROR: Query ikke oprettet korrekt. Se ovenover for hvor fejlen er at finde og find svaret i den givne info.\n`;
    }
    else if(/^SELECT [A-Za-z0-9*]+$/.test(choice)) {
      if(data === undefined || data === ``) {
        sql = `${choice} FROM ${this.table}`;
      }
      else {
        sql = `${choice} FROM p2.${this.table} WHERE ${data}`;
      }
    }
    else{
      switch(choice) {
        case `INSERT`:
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
           * Er der ikke flere elementer, dvs. der er ikke flere "col = var" der skal postes, så antages det her at datasættet er tomt.
           */
          let done = false;
          while(!done) {
            columns += /^\w+/.exec(data);
            data = data.slice(`${/^\w+/.exec(data)} = `.length,data.length);
            values += /^\w+/.exec(data);
            data = data.slice(`${/^\w+/.exec(data)} `.length,data.length);
    
            /* NOTE: af en eller anden grund skal det være == og IKKE === . Tjek gerne op på det */
            if(/^\w+/.exec(data) == `AND`) {
              columns += `, `;
              values  += `, `;
              data = data.slice(`AND `.length,data.length);
            }
            else {
              done = true;
            }
          }
          
          sql = `INSERT INTO ${this.table} (${columns}) VALUES (${values})`;
          break;
        case `UPDATE`:
          const initial = /\w+ = \w+/.exec(data);
          const newData = data.slice((`${initial} TO `).length,data.length);
          const changeTo = /\w+ = \w+/.exec(newData);
          sql = `UPDATE ${this.table} SET ${initial} WHERE ${changeTo}`;
          break;
        case `DELETE`:
          sql = `DELETE FROM ${this.table} WHERE ${data}`;
          break;
      }
    }

    return sql;
  }

  parserValidator(choice,data) {
    let choiceValid = false;
    if(/^SELECT [A-Za-z0-9*]+$/.test(choice) ||
       /^INSERT$/.test(choice) ||
       /^UPDATE$/.test(choice) ||
       /^DELETE$/.test(choice)) {
         choiceValid = true;
       }
    else {
        console.log(`\n\nChoice variablen er sat forkert. Har du husket at det skal være store bogstaver? Korrekt sat Mellemrum?\n\n`);
    }

    let dataValid = false;
    const dataRe = /^\w+ = \w+/;
    if(data === undefined || data === `` ||
       dataRe.test(data)) {
        dataValid = true;
    }
    else{
        console.log(`\n\nData variablen er sat forkert. Har du husket at der skal være mellemrum mellem = tegnet og de forskellige operatorer?\n\n`);
    }

    if(choiceValid && dataValid) {
        return true;
    }
    else {
        return false;
    }
  }

  get(columns, data) {
    this.method = `get`;
    this.sql = this.parser(columns,data);
    return new Promise((resolve, reject) => {
      this.connect.query(this.sql,
        (error, result) => {
          if (error) {
            console.log(`Here at node/Database/Database.js-data the error \n${error.code}\n
            and ${error.stack} should be saved in the Database`);
            reject(error);
          }
          else {
            resolve(result);
          }
        });
    });
  }

  /* Virker ikke endnu */
  post(columns,data) {
    this.method = `post`;
    this.sql = this.parser(columns,data);
    return new Promise((resolve, reject) => {
      this.connect.query(`INSERT INTO ${table}${queries} VALUES ${objects}`,
        (error, result) => {
          if (error) {
            console.log(`Here at node/Database/Database.js-data the error \n${error.code}\n
            and ${error.stack} should be saved in the Database`);
            reject(error);
          }
          else {
            resolve(result);
          }
        });
    });
  }

  /* Virker ikke endnu */
  put(table, queries, objects) {
    this.method = `put`;
    this.sql = this.parser(columns,data);
    return new Promise((resolve, reject) => {
      this.connect.query(`DOESNT WORK ${table}${queries}${objects}`,
        (error, result) => {
          if (error) {
            console.log(`Here at node/Database/Database.js-data the error \n${error.code}\n
            and ${error.stack} should be saved in the Database`);
            reject(error);
          }
          else {
            resolve(result);
          }
        });
    });
  }

  /* Virker ikke endnu */
  delete(table, queries, objects) {
    this.method = `delete`;
    return new Promise((resolve, reject) => {
      this.connect.query(`DOESNT WORK ${table}${queries}${objects}`,
        (error, result) => {
          if (error) {
            console.log(`Here at node/Database/Database.js-data the error \n${error.code}\n
            and ${error.stack} should be saved in the Database`);
            reject(error);
          }
          else {
            resolve(result);
          }
        });
    });
  }
}


module.exports = {
  Database,
};
