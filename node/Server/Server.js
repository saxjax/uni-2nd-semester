const express = require(`express`);
// const bodyParser = require(`body-parser`);
const mysql = require(`mysql`);

const { ViewController } = require(`../ViewController/ViewController.js`);

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
    this.root = __dirname.slice(0, -(`node/Server`.length));
  }

  startServer(startMsg) {
    this.staticMiddleware();
    this.urlPatterns();

    return this.app.listen(this.port, () => console.log(`${startMsg}`));
  }

  urlPatterns() {
    const Show = new ViewController();
    this.app.get(`/template`, (req, res)  => Show.template(req, res));
    this.app.get(`/`, (req, res)          => Show.homePage(req, res));
    this.app.get(`/about`, (req, res)     => Show.aboutPage(req, res));
    this.app.get(`/form/`, (req, res)     => Show.businessLogicPage(req, res));
    this.app.get(`/1234`, (req, res)      => Show.testPage(req, res));
    this.app.get(`/register`, (req, res)  => Show.registerPage(req, res));
    this.app.get(`/login`, (req, res)     => Show.loginPage(req, res));
    this.app.get(`/eval`, (req, res)      => Show.evalPage(req, res));
    this.app.get(`/rapport`, (req, res)   => Show.rapPage(req, res));
    this.app.get(`/elementList`, (req, res) => Show.elementList(req, res));
  }

  staticMiddleware() {
    this.app.use(`/css`, express.static(`${this.root}/www/css`));
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
