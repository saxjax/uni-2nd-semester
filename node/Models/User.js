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
    // ID
    this.idColumnName = `iduser`;
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
    return this.query(`SELECT *`, `username = "${this.username}" AND password = "${this.password}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  /* UNDER CONSTRUCTION */
  async validateRegister() {
    let validationCheck = false;
    if (!isEmpty(this.username) && !isEmpty(this.firstName) && !isEmpty(this.lastName) && !isEmpty(this.email)) {
      this.data = await this.query(`SELECT *`, `username = "${this.username}" OR email = "${this.email}"`);
      if (this.data.length > 0) {
        console.log(`User already registered`);
      }
      else {
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
