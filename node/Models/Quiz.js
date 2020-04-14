const { Model } = require(`./AbstractClasses/Model.js`);

class Quiz extends Model {
  constructor(req) {
    super(req);
    this.elementtype = `quiz`;
    this.table = `quiz`;
    // Session
    this.groupId = (typeof req.session.groupId  !== `undefined` ? req.session.groupId  : undefined);
    this.userId  = (typeof req.session.userId    !== `undefined` ? req.session.userId     : undefined);
    // ID
    this.idColumnName = `idquiz`;
    this.queryId = (typeof req.params.queryId       !== `undefined` ? req.session.queryId      : undefined);
    // Columns
  }
}
module.exports = {
  Quiz,
};
