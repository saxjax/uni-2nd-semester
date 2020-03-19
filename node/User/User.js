/* eslint no-console: off */
const bodyParser = require(`body-parser`);
const mysql = require(`mysql`);

class User {
  constructor(req) {
    this.name = `User`;
    this.username = req.body.username;
    this.password = req.body.password;

    this.con = mysql.createConnection({
      host: `213.32.247.201`,
      user: `ADMIN`,
      port: `3306`,
      password: `Admin123!`,
      database: `p2`,
    });
  }

  loginValid() {
    const res = new Promise((resolve, reject) => {
      console.log(this.username);
      console.log(this.password);
      if (this.username && this.password) {
        this.con.query(`SELECT * FROM users WHERE username = ? AND password = ?`, [this.username, this.password], (error, results, fields) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          if (results.length > 0) {
            console.log(`Query worked`);
            resolve(true);
          }
          resolve(false);
        })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      }
    });
    return res;
  }
}

module.exports = {
  User,
};
