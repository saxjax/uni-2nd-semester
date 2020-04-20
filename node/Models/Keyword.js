const { Model } = require(`./AbstractClasses/Model.js`);

/* UNDER CONSTRUCTION */

class Keyword extends Model {
  constructor(req) {
    super(req);
    this.elementType = `keyword`;
    this.table = `document_keyword`;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName = `ID_KEYWORD`;
          this.idQuery      = req.params.idQuery;
          this.loggedIn = req.session.loggedIn;
          break;
        case `POST`:
          // none yet
          break;
        default: break;
      }
    }
  }
}
module.exports = {
  Keyword,
};
