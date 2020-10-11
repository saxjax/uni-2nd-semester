/* eslint no-console: off */

const path = require(`path`);

const { Model } = require(path.join(__dirname, `AbstractClasses`, `Model.js`));

/* Document er det øverste objekt indenfor en Group.
 * Document har Evaluation og Section knyttet til sig, primært.
 * Dertil er alle keywords i Evaluations og Sections tilknyttet Document.
 */

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

  /* Formål: Denne funktion bruges sammen med Array.sort(compareSectionNumber) til at sortere sections efter sectionnumber
   * Input : to section objekter
   * Output: -1 hvis a skal være før b ,0 hvis der ikke skal gøres noget ,-1 hvis b skal være før a
   */
  compareSectionNumber(a, b) {
    // a skal være før b efter sortering
    if (a.number < b.number) {
      return -1;
    // b skal være før a efter sortering
    } if (a.number > b.number) {
      return 1;
    // and and b are the same
    }
    return 0;
  }

  /* Formål: Denne funktion bruges sammen med Array.sort(compareSectionNumber) til at sortere sections efter sectionnumber
   * Input : to section objekter
   * Output: -1 hvis a skal være før b ,0 hvis der ikke skal gøres noget ,-1 hvis b skal være før a
   */
  compareKeyword(a, b) {
    // a skal være før b efter sortering
    if (a.keyword < b.keyword) {
      return -1;
    // b skal være før a efter sortering
    } if (a.keyword > b.keyword) {
      return 1;
    // and and b are the same
    }
    return 0;
  }

  /* Formål: Denne funktion bruges sammen med Array.sort(compareTitle) til at sortere sections efter titel
   * Input : to section objekter
   * Output: -1 hvis a skal være før b ,0 hvis der ikke skal gøres noget ,-1 hvis b skal være før a
   */
  compareTitle(a, b) {
    // a skal være før b efter sortering
    if (a.title < b.title) {
      return -1;
    // b skal være før a efter sortering
    } if (a.title > b.title) {
      return 1;
    // and and b are the same
    }
    return 0;
  }
}


module.exports = {
  Document,
};
