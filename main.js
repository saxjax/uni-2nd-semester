const { Server } = require(`./node/Server/Server.js`);

const Dev = new Server();
Dev.startServer(`Developmentserver up and running on localhost:${Dev.port}`);
Dev.query();
