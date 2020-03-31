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
    this.firstName = req.body.firstName;
    this.lastName = req.body.lastName;
    this.studySubject = req.body.studySubject;
    this.semester = req.body.semester;
    this.university = req.body.university;
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

  validateRegister() {                                                                                          // wanted to use typeof, but did not work...
    if (isNaN(this.firstName) && isNaN(this.lastName) && isNaN(this.studySubject) && isNaN(this.university) && !(isNaN(this.semester))) {
      return true;
    }
    return false;
  }
}

module.exports = {
  User,
};
