/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

/* UNDER CONSTRUCTION */

class User extends Model {
  constructor(req) {
    super(req);
    this.elementType = `user`;
    this.table = `user`;
    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `ID_USER`;
          this.idQuery       = req.params.idQuery;
          break;
        case `POST`:
          this.username     = req.body.username;
          this.password     = req.body.password;
          this.firstName    = req.body.firstName;
          this.lastName     = req.body.lastName;
          this.studySubject = req.body.studySubject;
          this.semester     = req.body.semester;
          this.university   = req.body.university;
          this.email        = req.body.email;
          break;
        default: break;
      }
    }
  }

  /* Formål: At validere om et brugernavn og password matcher og så returnere brugerens data
   * Input : Et brugernavn og et password.
   * Output: En row af data fra 1 bruger.
   */
  async loginValid() {
    return this.query(`SELECT *`, `USER_NAME = "${this.username}" AND PASSWORD = "${this.password}"`)
      .then((result) => result)
      .catch((error) => error); no;
  }

  alreadyLoggedIn() {
    if (this.loggedin === true) {
      return true;
    }
    return false;
  }

  /* Formål: Checker først om register req indeholder de nødvendige informationer og derefter om brugen allerede
   * er oprettet i database
   * input: Request sendt fra register form
   * Output: True/false */
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
