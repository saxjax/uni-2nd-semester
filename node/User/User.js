/* eslint no-console: off */
const { Database } = require(`../Database/Database.js`);

class User extends Database{
  constructor(req) {
    super()
    this.name = `User`;
    this.table = `users`;
    this.queries = ``;
    this.objects = [];
    this.username = req.body.username;
    this.password = req.body.password;
  }

  async loginValid() {
    this.queries = `username = ? AND password = ?`;
    this.objects = [this.username, this.password];
    return this.getID(this.table, this.queries,this.objects)
    .then(result => result)
    .catch(error => error);
  }
}

module.exports = {
  User,
};
