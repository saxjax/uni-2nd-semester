const settings = {
  // Express settings
  name: `Server`,    // Angiver funktionaliteten af disse settings. Har ingen funktionsmæssig betydning.
  root: __dirname,   // Medsender root directoriet så MasterController altid henviser til main.js root
  port: 8080,        // Angiver porten som programmet skal kører på.

  // developer settings
  debug: true,       // Angiver om programmet skal køre i udviklingsmode eller i productionmode.
  skipAccess: false, // Angiver om programmet automatisk skal logges ind som Test User i Tester Group

  // SQLDatabase settings
  db: {
    schema: `p2`,         // navn på SQLDatabasen
    host: `localhost`,    // ip addressen på SQLDatabasen
    port: `3306`,         // portnummer på SQLDatabasen
    user: `admin`,        // brugernavn på SQLDatabasen
  },
//   // spaced repetition settings
//   minTimestampDebug: 1, // angiver hvor mange timer der min skal gå før en evalueringsopgave skal repeteres i debugmode
//   minTimestamp: 24,     // angiver hvor mange timer der min skal gå før en evalueringsopgave skal repeteres.
};

module.exports.serverSettings = settings;
