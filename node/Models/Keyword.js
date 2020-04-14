const { Model } = require(`./AbstractClasses/Model.js`);

/* UNDER CONSTRUCTION */

class Keyword extends Model {
  constructor(req) {
    super(req);
    this.elementtype = `keyword`;
    this.table = `document_keyword`;
    // Session
    this.groupId         = (typeof req.session.groupId  !== `undefined` ? req.session.groupId  : undefined);
    this.userId  = (typeof req.session.userId    !== `undefined` ? req.session.userId     : undefined);
    // ID
    this.idColumnName = `idkeyword`;
    this.queryId      = (typeof req.params.queryId !== `undefined` ? req.params.queryId : undefined);
    // Columns
  }
}
module.exports = {
  Keyword,
};
