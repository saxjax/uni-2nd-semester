const { Server } = require(`./node/Server.js`);

const devSettings = {
  name: `Developmentserver`, // Angiver funktionaliteten af disse settings. Har ingen funktionsmæssig betydning.
  port: 3000,                // Angiver porten som programmet skal kører på.
  debug: true,               // Angiver om programmet skal køre i udviklingsmode eller i productionmode (FIXME: ikke endnu fuldt implementeret)
  skipAccess: false,          // Angiver om programmet automatisk skal logges ind som Test User i Tester Group
};
const Start = new Server(devSettings);

/*
const stageSettings = {
  name: `Staginserver`,
  port: 3000,
  debug: false,
  skipAccess: false,
};
const Start = new Server(stageSettings);
*/
/*
const prodSettings = {
  name: `Productionserver`,
  port: 3000,
  debug: false,
  skipAccess: false,
  userId: null,
  groupId: null,
};
const Start = new Server(prodSettings);
*/


Start.startServer();
