const { Evaluation } = require(`./AbstractClasses/Evaluation.js`);

/* UNDER CONSTRUCTION */

class Flashcard extends Evaluation {
  constructor(req) {
    super(req);
    this.elementtype = `flashcard`;
    this.table = `flashcard`;
    // Session
    this.groupId = (typeof req.session.groupId  !== `undefined` ? req.session.groupId  : undefined);
    this.userId  = (typeof req.session.userId    !== `undefined` ? req.session.userId     : undefined);
    // ID
    this.idColumnName = `flashcard`;
    this.queryId = (typeof req.params.queryId !== `undefined` ? req.session.queryId : undefined);
    // Columns
    this.concept    = (typeof req.body.concept    !== `undefined` ? req.body.concept    : undefined);
    this.definition = (typeof req.body.definition !== `undefined` ? req.body.definition : undefined);
  }
}
module.exports = {
  Flashcard,
};
