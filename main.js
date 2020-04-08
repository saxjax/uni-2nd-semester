const { Server } = require(`./node/Server/Server.js`);

const devSettings = {
  name: `Developmentserver`,
  port: 3000,
  debug: true, // Denne værdi er UNDER CONSTRUCTION
};
/*
const stageSettings = {
  name: `Staginserver`,
  port: 3000,
  debug: false,
}
*/
/*
const prodSettings = {
  name: `Productionserver`,
  port: 3000,
  debug: false,
}
*/
const Dev = new Server(devSettings);

Dev.startServer();
