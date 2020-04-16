/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model`);

/* UNDER CONSTRUCTION */

class Group extends Model {
  constructor(req) {
    super();
    this.elementtype = `group`;
    this.table = `user_group`;

    if (this.validateMethodChoice()) {
      this.groupId = req.session.groupId;
      this.userId  = req.session.userId;
      switch (req.method) {
        case `GET`:
          this.idColumnName = `ID_USER_GROUP`;
          this.queryId = this.groupId;
          break;
        case `POST`: case `UPDATE`:
          this.name = req.body.name;
          break;
        default: break;
      }
    }
  }

  /* UN */
}

module.exports = {
  Group,
};
