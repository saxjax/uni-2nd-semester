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
    this.firstName = req.body.firstName;
    this.lastName = req.body.lastName;
    this.studySubject = req.body.studySubject;
    this.semester = reg.body.semester;
    this.password = req.body.password;
    this.university = req.body.university;
    this.email = req.body.email;
    this.email = req.body.email;
  }

  async loginValid() {
    this.data = await this.query(`SELECT *`, `username = "${this.username}" AND password = "${this.password}"`)
      .then((result) => result)
      .catch((error) => error);

    return this.data;
  }

  /* Skal implementeres med sessions */
  alreadyLoggedIn() {
    this.cookie = false;
    return this.cookie;
  }
}

module.exports = {
  User,
};
