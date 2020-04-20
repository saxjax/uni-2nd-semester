/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

/* UNDER CONSTRUCTION */

class User extends Model {
  constructor(req) {
    super(req);
    this.elementtype = `user`;
    this.table = `user`;
    // Session
    this.groupId      = (typeof req.session.groupId     !== `undefined` ? req.session.groupId     : undefined);
    this.userId  = (typeof req.session.userId    !== `undefined` ? req.session.userId     : undefined);
    this.loggedin  = (typeof req.session.loggedin    !== `undefined` ? req.session.loggedin     : undefined);
    // ID
    this.idColumnName = `ID_USER`;
    this.queryId       = (typeof req.params.queryId       !== `undefined` ? req.session.queryId      : req.session.userId);
    // Columns
    this.username     = (typeof req.body.username       !== `undefined` ? req.body.username       : undefined);
    this.password     = (typeof req.body.password       !== `undefined` ? req.body.password       : undefined);
    this.firstName    = (typeof req.body.firstName      !== `undefined` ? req.body.firstName      : undefined);
    this.lastName     = (typeof req.body.lastName       !== `undefined` ? req.body.lastName       : undefined);
    this.studySubject = (typeof req.body.studySubject   !== `undefined` ? req.body.studySubject   : undefined);
    this.semester     = (typeof req.body.semester       !== `undefined` ? req.body.semester       : undefined);
    this.university   = (typeof req.body.university     !== `undefined` ? req.body.university     : undefined);
    this.email        = (typeof req.body.email          !== `undefined` ? req.body.email          : undefined);
  }

  /* Formål: At validere om et brugernavn og password matcher og så returnere brugerens data
   * Input : Et brugernavn og et password.
   * Output: En row af data fra 1 bruger.
   */
  async loginValid() {
    return this.query(`SELECT *`, `USER_NAME = "${this.username}" AND PASSWORD = "${this.password}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  alreadyLoggedIn() {
    if (this.loggedin === true) {
      return true;
    }
    return false;
  }

  /* UNDER CONSTRUCTION */
  async validateRegister() {
    let validationCheck = false;
    if (!isEmpty(this.username) && !isEmpty(this.firstName) && !isEmpty(this.lastName) && !isEmpty(this.email)) {
      this.data = await this.query(`SELECT *`, `USER_NAME = "${this.username}" OR EMAIL = "${this.email}"`);
      if (this.data.length > 0) {
        console.log(`User already registered`);
      }
      else {
        validationCheck = true;
      }
    }
    return validationCheck;
  }

  /* Formål: At oprette en bruger i databasen hvis validering returnerer 'True'
   * Input : N/A
   * Output: True/False
   */
  async createUser() {
    try {
      await this.query(`INSERT`, `USER_NAME = "${this.username}" `
                     + `AND PASSWORD = "${this.password}" `
                     + `AND FIRST_NAME = "${this.firstName}" `
                     + `AND LAST_NAME = "${this.lastName}" `
                     + `AND UNIVERSITY = "${this.university}" `
                     + `AND STUDY_SUBJECT = "${this.studySubject}" `
                     + `AND EMAIL = "${this.email}" `
                     + `AND SEMESTER = "${this.semester}"`);
    }
    catch (error) {
      console.log(`User with username: ${this.username} FAILED to be created`);
      console.log(`${error}`);
      return false;
    }
    console.log(`User created with username: ${this.username}`);
    return true;
  }
}


module.exports = {
  User,
};

function isEmpty(str) {
  return (!str || str.length === 0);
}
