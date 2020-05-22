/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model`);

/* Group er, sammen med User, de to overordnede klasser der operere i hele programmet
 * Group indeholder det unikke grupperum, hvor alle resourcer der oprettes i grupperummet knyttes til Group
 * Group sikrer at alle brugere kan arbejde sammen med fælles resourcer, uden inteference fra andre brugere af programmet.
 */
class Group extends Model {
  /* Alle groupType/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super();
    this.elementType = `${this.groupType}`;
    this.table = `${this.groupTable}`;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `${this.groupCol}`;
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
    this.idGroup = await this.getUuid();
    await this.query(`INSERT`, `${this.GNameCol} = "${this.name}" AND ${this.groupCol} = "${this.idGroup}"`);

    this.table = `user`;
    for (let i = 0; i < this.members.length; i++) {
      const newUser = await this.query(`SELECT *`, `${this.UUsernameCol} = "${this.members[i]}"`); // eslint-disable-line no-await-in-loop
      if (newUser[0].idGroup === `undefined`) {
        await this.query(`UPDATE`, `${this.groupCol} = "${this.idGroup}" WHERE ${this.UUsernameCol} = "${this.members[i]}"`); // eslint-disable-line no-await-in-loop
      }
      else if (newUser[0].elementType === `user`) {
        // TODO: Future works: En respons til brugeren om at brugernavnet er tastet forkert. Dette skal dog nok valideres inden på Frontend siden på en eller anden måde.
      }
    }
  }

  /* Formål: At vise brugeren de grupperum som er mulige at vælge imellem.
             Denne funktion er nødvendig, da den undgår req.session.idGroup (som brugeren jo ikke har valgt endnu)
   * Input : @User som er den user der er logget ind og skal til at vælge grupperum
   * Output: Intet, men opretter en this.idGroup til brug til at oprette req.session.idGroup
   */
  async getIdGroupFromUser(User) {
    const groupIdFromUser = await User.query(`SELECT ${User.idColumnGroup}`, `${User.idColumnUser} = "${User.idUser}"`);
    this.idGroup = groupIdFromUser[0].idGroup;
  }
}

module.exports = {
  Group,
};
