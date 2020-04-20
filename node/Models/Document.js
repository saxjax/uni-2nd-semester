/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

/* UNDER CONSTRUCTION */

class Document extends Model {
  constructor(req) {
    super();
    this.elementType = `document`;
    this.table       = `document`;
    // Session from session
    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName   = `ID_DOCUMENT`;
          this.idQuery        =  req.params.idQuery;
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
