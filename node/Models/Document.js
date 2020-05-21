/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

/* FIXME: UNDER CONSTRUCTION */

class Document extends Model {
  /* Alle documentType/Col og Table er hentet fra ParseSql! */
  constructor(req) {
    super();
    this.elementType = `${this.documentType}`;
    this.table       = `${this.documentTable}`;
    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName   = `${this.documentCol}`;
          this.idQuery        =  req.params.idQuery;
          break;
        case `POST`:
          this.title      = req.body.title;
          this.idDocument = undefined;
          break;
        default: break;
      }
    }
  }

  /* Formål: At kunne oprette den givne model i databasen ud fra posted data fra en form.
             Der bliver desuden automatisk oprettet de forskellige dependencies/foreign keys som objektet tilhører.
   * Input : Et objekt oprettet med et request med postdata i body samt user/group data i session
   * Output: Dokumentets ID
   */
  async insertToDatabase() {
    this.idDocument = await this.getUuid();
    const data = `${this.groupCol} = "${this.idGroup}" `
                + `AND ${this.documentCol} = "${this.idDocument}" `
                + `AND ${this.userCol} = "${this.idUser}" `
                + `AND ${this.DTitleCol} = "${this.title}"`;
    await this.query(`INSERT`, data);
    return this.idDocument;
  }
}

module.exports = {
  Document,
};
