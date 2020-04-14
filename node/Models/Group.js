/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model`);

/* UNDER CONSTRUCTION */

class Group extends Model {
  constructor(req) {
    super(req);
    this.elementtype = `group`;
    this.table = `user_group`;
    // Session
    this.groupId = (typeof req.session.groupId        !== `undefined` ? req.session.groupId       : undefined);
    this.userId  = (typeof req.session.userId         !== `undefined` ? req.session.userId        : undefined);
    // ID
    this.idColumnName = `iduser_group`;
    this.queryId = (typeof req.params.queryId         !== `undefined` ? req.params.queryId        : undefined);
    // Columns
    this.name = (typeof req.body.name !== `undefined` ? req.body.name : undefined);
  }
}

module.exports = {
  Group,
};
