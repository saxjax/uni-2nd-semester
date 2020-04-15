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
          this.idColumnName = `iduser_group`;
          this.queryId = req.params.queryId;
          break;
        case `POST`: case `UPDATE`:
          this.name = req.body.name;
          break;
        default: break;
      }
    }
  }
}

module.exports = {
  Group,
};
