/* eslint no-console: off */

const { Model } = require(`./AbstractClasses/Model`);

/* Section er det objekt som indeholder data vedrørende de afsnit der findes i et dokument.
 * UDVID MED INFORMATION NÅR SECTION ER DESIGNET
 */

class Section extends Model {
  constructor(req) {
    super(req);
    this.elementtype = `section`;
    this.table = `document_section`;

    if (this.validRequest(req)) {
      this.idGroup = req.session.idGroup;
      this.idUser  = req.session.idUser;
      this.loggedIn = req.session.loggedIn;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName   = `ID_USER_GROUP`;
          this.idQuery        =  req.params.idQuery;
          break;
        case `POST`:
          this.title    = req.body.title;
          this.content  = req.body.content;
          this.keywords = req.body.keywords;
          this.number   = req.body.number;
          break;
        case `TEST`:
          this.elementtype = `section`;
          this.table = `document_section`;
          this.idSection = idSection || undefined;
          this.idDocument = idDocument || undefined;
          this.idUser = idUser || undefined;
          this.idGroup = idGroup || undefined;
          this.title = title || undefined;
          this.content = content || undefined;
          this.number = number || undefined;
          this.teaser = teaser || undefined;
          this.keywords = keywords || undefined;
          break;

        default: break;
      }
    }
  }

  async insertSectionToDatabase() {
    try {
      await this.query(`INSERT`, `SECTION_TITLE = "${this.title}" `
                       + `AND SECTION_CONTENT = "${this.content}" `
                       + `AND KEYWORDS = "${this.keywords}" `
                       + `AND SECTION_NUMBER = "${this.number}" `
                       + `AND ID_USER_GROUP = "${this.idGroup}"`);
    }
    catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
}

module.exports = {
  Section,
};
