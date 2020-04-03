/* eslint no-console: off */

const { Database } = require(`../Database/Database.js`);
class User extends Database {
  constructor(req) {
    super();
    this.name = `User`;
    this.table = `user`;
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

  async validateRegister() {
    let validationCheck = false;
    if (!isEmpty(this.firstName) && !isEmpty(this.lastName) && !isEmpty(this.studySubject) && !isEmpty(this.university) && !isEmpty(this.semester)) {
      this.data = await this.query(`SELECT *`, `username = "${this.username}" OR email = "${this.email}"`);
      if (this.data.length > 0) {
        console.log(`User already registered`);
      }
      else {
        this.register_data = await this.query(`INSERT`, `username = "${this.username}" AND password = "${this.password}" AND firstname = "${this.firstName}" AND lastname = "${this.lastName}" AND university = "${this.university}" AND studysubject = "${this.studySubject}" AND semester = "${this.semester}"`);
        validationCheck = true;
      }
    }
    return validationCheck;
  }
}

module.exports = {
  User,
};

function isEmpty(str) {
  return (!str || str.length === 0);
}
