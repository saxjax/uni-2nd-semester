/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model.js`);

/* FIXME: UNDER CONSTRUCTION */

class Document extends Model {
  constructor(req) {
    super();
    this.elementType = `document`;
    this.table       = `document`;
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

  /* Formål: At kunne oprette den givne model i databasen ud fra posted data fra en form.
             Der bliver desuden automatisk oprettet de forskellige dependencies/foreign keys som objektet tilhører.
   * Input : Et objekt oprettet med et request med postdata i body samt user/group data i session
   * Output: True hvis queren inserter, ellers false hvis der sker en fejl.
   */
  async insertToDatabase() {
    try {
      const docID = await this.query(`INSERT`, `ID_USER_GROUP = "${this.idGroup}" `
                                   + `AND ID_USER = ${this.idUser} `
                                   + `AND TITLE = "${this.title}"`);
      return docID;
    }
    catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}


module.exports = {
  Document,
};
