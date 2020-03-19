/* eslint no-console: off */
const { Database } = require(`../Database/Database.js`);

class User extends Database{
  constructor(req) {
    super()
    this.name = `User`;
    this.username = req.body.username;
    this.password = req.body.password;
    this.table = `SELECT * FROM users `;
    this.string = `WHERE `;
    this.objects = [];
  }

  loginValid() {
    this.string = `WHERE username = ? AND password = ?`;
    this.objects = [this.username, this.password];
    return this.query(this.table,this.string,this.objects)
    .then(result => result)
    .catch(error => error);
  }
}

module.exports = {
  User,
};
