/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

/* FIXME: UNDER CONSTRUCTION */

class User extends Model {
  /* Alle userType/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super();
    this.req = req;
    this.elementType = `${this.userType}`;
    this.table = `${this.userTable}`;
    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `${this.userCol}`;
          this.idQuery       = this.idUser;
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

  /* Formål: At oprette en bruger i databasen hvis validering returnerer 'True'
   * Input : N/A
   * Output: True/False
   */
  async insertToDatabase() {
    this.idUser = await this.getUuid();
    await this.query(`INSERT`, `${this.groupCol} = "${this.idGroup}" `
                     + `AND ${this.userCol} = "${this.idUser}" `
                     + `AND ${this.UUsernameCol} = "${this.username}" `
                     + `AND ${this.UPasswordCol} = "${this.password}" `
                     + `AND ${this.UFirstNameCol} = "${this.firstName}" `
                     + `AND ${this.ULastNameCol} = "${this.lastName}" `
                     + `AND ${this.UUniversityCol} = "${this.university}" `
                     + `AND ${this.UStudySubjectCol} = "${this.studySubject}" `
                     + `AND ${this.UEmailCol} = "${this.email}" `
                     + `AND ${this.USemesterCol} = "${this.semester}"`);
    return this.idUser;
  }

  /* Formål: At validere om et brugernavn og password matcher og så returnere brugerens data
   * Input : Et brugernavn og et password.
   * Output: En row af data fra 1 bruger.
   */
  async loginValid() {
    const data = await this.query(`SELECT *`, `${this.UUsernameCol} = "${this.username}" AND ${this.UPasswordCol} = "${this.password}"`);
    if (Object.keys(data[0]).length > 1) {
      this.req.session.idUser = data[0].idUser;
      this.req.session.loggedIn = true;
      this.req.session.username = data[0].username;
    }
    else {
      throw new Error(`USER_NOT_EXISTING: LoginValid() did not find any user matching your input in SQL-Database`);
    }
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
    if (!isEmpty(this.username) && !isEmpty(this.firstName) && !isEmpty(this.lastName) && !isEmpty(this.email)) { // FIXME: Logisk udtryk bliver lavet om til metodekald
      this.data = await this.query(`CUSTOM`, `SELECT * FROM  ${this.table} WHERE ${this.UUsernameCol} = "${this.username}" OR ${this.UEmailCol} = "${this.email}"`); // FIXME: Returnerer et tomt Rowpackage hvsi den ikke er custom
      if (this.data.length !== 0) { // Means that user hasn't registered before
        throw new Error(`USER_ALREADY_REGISTERED`);
      }
    }
  }
}


module.exports = {
  User,
};

function isEmpty(str) {
  return (!str || str.length === 0);
}
