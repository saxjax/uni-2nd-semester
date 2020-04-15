const { Server } = require(`./node/Server.js`);
/*
const devSettings = {
  name: `Developmentserver`,
  port: 3000,
  debug: true, // Denne værdi er UNDER CONSTRUCTION
  skipAccess: false,
  userId: null,
  groupId: null,
};
const Start = new Server(devSettings);
*/

const skipAccessSettings = {
  name: `Developmentserver`,
  port: 3000,
  debug: true, // Denne værdi er UNDER CONSTRUCTION
  skipAccess: true,
  userId: `553e422d-7c29-11ea-86e2-2c4d54532c7a`,
  groupId: `34701dd1-7c29-11ea-86e2-2c4d54532c7a`,
};
const Start = new Server(skipAccessSettings);

/*
const stageSettings = {
  name: `Staginserver`,
  port: 3000,
  debug: false,
  skipAccess: false,
  userId: null,
  groupId: null,
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
