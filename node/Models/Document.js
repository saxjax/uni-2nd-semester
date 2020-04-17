/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

/* UNDER CONSTRUCTION */

class Document extends Model {
  constructor(req) {
    super();
    this.elementtype = `document`;
    this.table       = `document`;
    // Session from session
    if (this.validateMethodChoice(req)) {
      this.groupId = req.session.groupId;
      this.userId  = req.session.userId;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName   = `ID_DOCUMENT`;
          this.queryId        =  req.params.queryId;
          break;
        case `POST`:
          this.title     = req.body.title;
          break;
        default: break;
      }
    }
  }
}


module.exports = {
  Document,
};
