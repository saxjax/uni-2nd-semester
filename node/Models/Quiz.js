const { Evaluation } = require(`./AbstractClasses/Evaluation.js`);

class Quiz extends Evaluation {
  constructor(req) {
    super();
    this.elementtype = `quiz`;
    this.table = `quiz`;
    // Session
    this.groupId = (typeof req.session.groupId  !== `undefined` ? req.session.groupId  : undefined);
    this.userId  = (typeof req.session.userId    !== `undefined` ? req.session.userId     : undefined);
    // ID
    this.idColumnName = `ID_QUIZ`;
    this.queryId = (typeof req.params.queryId       !== `undefined` ? req.params.queryId      : undefined);
    // Columns
  }
}
module.exports = {
  Quiz,
};
