/* eslint no-console: off */
const { Database } = require(`../Database/Database.js`);

class User extends Database{
  constructor(req) {
    super()
    this.name = `User`;
    this.table = `users`;
    this.command = ``;
    this.get = `SELECT * FROM ${this.table} WHERE `
    this.post = `INSERT INTO ${this.table} VALUES `
    this.queries = ``;
    this.objects = [];
    this.username = req.body.username;
    this.password = req.body.password;
  }

  loginValid() {
    this.command = this.get;
    this.queries = `username = ? AND password = ?`;
    this.objects = [this.username, this.password];
    return this.query(this.command, this.queries,this.objects)
    .then(result => result)
    .catch(error => error);
  }
}

module.exports = {
  User,
};
