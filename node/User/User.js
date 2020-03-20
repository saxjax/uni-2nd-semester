/* eslint no-console: off */
const { Database } = require(`../Database/Database.js`);

class User extends Database {
  constructor(req) {
    super();
    this.name = `User`;
    this.table = `users`;
    this.data = ``;
    this.choice = `*`;
    this.queries = ``;
    this.objects = [];
    this.username = req.body.username;
    this.password = req.body.password;
  }

  async loginValid() {
    this.choice = `*`;
    this.queries = `username = ? AND password = ?`;
    this.objects = [this.username, this.password];
    this.data = await this.get(this.table, this.choice, this.queries, this.objects)
      .then((result) => result)
      .catch((error) => error);

    return this.data;
  }
}

module.exports = {
  User,
};
