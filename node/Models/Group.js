/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model`);

/* UNDER CONSTRUCTION */

class Group extends Model {
  constructor(req) {
    super();
    this.elementType = `group`;
    this.table = `user_group`;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `ID_USER_GROUP`;
          this.idQuery = this.idGroup;
          break;
        case `POST`:
          this.name = req.body.name;
          break;
        default: break;
      }
    }
  }

  /* Formål:
   * Input :
   * Output:
   */
  async insertToDatabase() {
    try {
      await this.query(`ID_USER_GROUP = "${this.idGroup}" `
                 + `AND NAME = "${this.name}"`);
    }
    catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
}

module.exports = {
  Group,
};
