const express = require(`express`);
// const bodyParser = require(`body-parser`);
const mysql = require(`mysql`);

const { Client } = require(`../Client/Client.js`);

class Server {
  constructor() {
    this.name = `Server`;
    this.port = 3000;
    this.app = express();
    this.con = mysql.createConnection({
      host: `213.32.247.201`,
      user: `ADMIN`,
      port: `3306`,
      password: `Admin123!`,
      database: `p2`,
    });
  }

  startServer(startMsg) {
    this.staticMiddleware();
    this.urlPatterns();
    this.query();

    return this.app.listen(this.port, () => console.log(`${startMsg}`));
  }

  urlPatterns() {
    const Show = new Client();
    this.app.get(`/`, (req, res) => Show.homePage(req, res));
    this.app.get(`/about`, (req, res) => Show.aboutPage(req, res));
    this.app.get(`/form/?{d+}/`, (req, res) => Show.businessLogicPage(req, res));
  }

  staticMiddleware() {
    this.app.use(express.static(`../../www/css`));
    this.app.use(express.static(`../../www/img`));
    this.app.use(express.static(`../../www/js`));
  }

  query() {
    this.con.connect((err) => {
      if (err) {
        throw err;
      }
      this.con.query(`SELECT * from books WHERE book_title like "Megadeth%"`, (error, result, fields) => {
        if (error) {
          throw error;
        }
        console.log(result[0].book_author);
      });
    });
  }
}

module.exports = {
  Server,
};
