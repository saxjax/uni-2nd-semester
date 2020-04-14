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
    this.groupId        = (typeof req.session.groupId     !== `undefined` ? req.session.groupId     : undefined);
    this.userId  = (typeof req.session.userId    !== `undefined` ? req.session.userId     : undefined);
    // ID
    this.idColumnName = `document_section`;
    this.queryId      = (typeof req.params.queryId    !== `undefined` ? req.params.queryId    : undefined);
    // Columns
    this.sectionNumber  = (typeof req.body.sectionNumber  !== `undefined` ? req.body.sectionNumber  : undefined);
    this.sectionTitle   = (typeof req.body.sectionTitle   !== `undefined` ? req.body.sectionTitle   : undefined);
    this.sectionTeaser  = (typeof req.body.sectionTeaser  !== `undefined` ? req.body.sectionTeaser  : undefined);
    this.sectionContent = (typeof req.body.sectionContent !== `undefined` ? req.body.sectionContent : undefined);
  }
}

module.exports = {
  Section,
};
