/* eslint no-console: off */
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
    return new Promise((resolve, reject) => {
      this.con.query(`SELECT * FROM users WHERE username = ? AND password = ?`, [this.username, this.password],
        (error, result) => {
          if (error) {
            console.log(`Message: Couldn't reach database, got:\n${error}`);
            reject(error);
          }
          else if (result.length > 0) {
            console.log(`Message: User found: |Username: ${this.username} Password: ${this.password}|`);
            resolve(true);
          }
          else {
            console.log(`Message: Wrong password, no entry found for |Username: ${this.username} Password: ${this.password}|`);
            resolve(false);
          }
        });
    });
  }
}

module.exports = {
  User,
};
