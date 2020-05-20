const { MasterController } = require(`./node/MasterController.js`);
const { serverSettings } = require(`./serverSettings`);

const Start = new MasterController(serverSettings);
Start.startServer();
