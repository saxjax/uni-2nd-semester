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
    this.data = await this.query(`SELECT *`, `username = "${this.username}" AND password = "${this.password}"`)
      .then((result) => result)
      .catch((error) => error);

    return this.data;
  }

  /* Skal implementeres med sessions */
  alreadyLoggedIn(user_session) {
    let loggedin = false;
    if(user_session.loggedin){
      loggedin = true;
    }
    return loggedin;
  }
}

module.exports = {
  User,
};
