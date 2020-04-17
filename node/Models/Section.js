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
    // Session
    if (this.validateMethodChoice(req)) {
      this.groupId = req.session.groupId;
      this.userId  = req.session.userId;
      switch (req.method) {
        case `GET`: case `UPDATE`: case `DELETE`:
          this.idColumnName   = `ID_USER_GROUP`;
          this.queryId        =  req.params.queryId;
          break;
        case `POST`:
          this.sectionTitle     = req.body.section.title;
          this.sectionContent   = req.body.section.content;
          this.sectionKeywords  = req.body.section.keywords;
          break;
        default: break;
      }
    }
  }

  async insertSectionToDatabase() {
    try {
      await this.query(`INSERT`, `SECTION_TITLE = "${this.sectionTitle}" `
                       + `AND SECTION_CONTENT = "${this.sectionContent}" `
                       + `AND KEYWORDS = "${this.sectionKeywords}" `
                       + `AND ID_USER_GROUP = "${this.groupId}"`);
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
