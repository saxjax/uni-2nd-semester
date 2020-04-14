/* eslint no-console: off */

const { Database } = require(`./AbstractClasses/Database.js`);

/* UNDER CONSTRUCTION */

class Document extends Database {
  constructor(req) {
    super();
    this.elementtype = `document`;
    this.table       = `document`;
    // Session from session
    this.groupId = (typeof req.session.groupId   !== `undefined` ? req.session.groupId    : undefined);
    this.userId  = (typeof req.session.userId    !== `undefined` ? req.session.userId     : undefined);
    // ID from params
    this.idColumnName = `iddocument`;
    this.queryId      = (typeof req.params.queryId !== `undefined` ? req.session.queryId : undefined);
    // Columns from body
    this.title   = (typeof req.body.title      !== `undefined` ? req.body.title      : undefined);
  }
}


module.exports = {
  Document,
};
