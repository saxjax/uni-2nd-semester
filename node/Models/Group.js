/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model`);

/* FIXME: UNDER CONSTRUCTION */

class Group extends Model {
  constructor(req) {
    super();
    this.elementType = `user_group`;
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
          this.members = req.body.members;
          break;
        default: break;
      }
    }
  }

  /* Formål: At oprette en gruppe hvor der bliver tilføjet de medlemmer af gruppen som bliver sendt med.
   * Input : Et objekt oprettet med et request med postdata i body samt user/group data i session
   * Output: True hvis queren inserter, ellers false hvis der sker en fejl.
   */
  async insertToDatabase() {
    await this.query(`INSERT`, `NAME = "${this.name}"`);
    const newGroup = await this.query(`SELECT *`, `NAME = "${this.name}"`);

    this.table = `user`;
    for (let i = 0; i < this.members.length; i++) {
      const newUser = await this.query(`SELECT *`, `USER_NAME = "${this.members[i]}"`);
      if (newUser[0].idGroup === `undefined`) {
        await this.query(`UPDATE`, `ID_USER_GROUP = "${newGroup[0].idGroup}" WHERE USER_NAME = "${this.members[i]}"`);
      }
      else if (newUser[0].elementType === `user`) {
        // FIXME: En respons til brugeren om at brugernavnet er tastet forkert. Dette skal dog nok valideres inden på Frontend siden på en eller anden måde.
      }
    }
  }

  async getIdGroupFromUser(User) {
    const groupIdFromUser = await User.query(`SELECT ${User.idColumnGroup}`, `${User.idColumnUser} = "${User.idUser}"`);
    this.idGroup = groupIdFromUser[0].idGroup;
  }
}

module.exports = {
  Group,
};
