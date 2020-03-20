const { Server } = require(`./node/Server/Server.js`);

const Dev = new Server();

Dev.startServer(`Developmentserver up and running on port ${Dev.port}`);
//Dev.query();

