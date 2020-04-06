/* eslint no-console: off */

const { Database } = require(`../Database/Database.js`);
const { Keyword } = require(`./Keyword`);

class Section extends Database {
  constructor() {
    super();
    this.name = `Section`;
    this.table = `document_section`;
    // this.iddocument = `not set`;
    // this.iddocument_section = `not set`;
    // this.section_number = `not set`;
    // this.section_title = `not set`;
    // this.section_teaser = `not set`;
    // this.section_content = `not set`;
    this.sectionData = undefined;
    this.keywords = undefined;
  }

  async getSectionContent() {
    // console.log(`prøver at hente : `+ this.queryId);
    return this.query(`SELECT content`, `iddocument_section = "${this.queryId}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  async getSection() {
    // console.log(`prøver at hente : `+ this.queryId);
    return this.query(`SELECT *`, `iddocument_section = "${this.queryId}"`)
      .then((result) => result)
      .catch((error) => error);
  }
}

module.exports = {
  Section,
};
