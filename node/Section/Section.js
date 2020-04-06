/* eslint no-console: off */

const { Database } = require(`../Database/Database.js`);

class Section extends Database {
  constructor(request) {
    super();
    this.name = `Section`;
    this.table = `document_section`;
    // this.iddocument = `not set`;
    // this.iddocument_section = `not set`;
    // this.section_number = `not set`;
    // this.section_title = `not set`;
    // this.section_teaser = `not set`;
    // this.section_content = `not set`;
    this.request = request;
  }

  // Henter alle sections i this.table på databasen
  // input: non
  // output: array af samtlige tilgængelige elementer i den pågældende table.
  async getAllSections() {
    return this.query(`SELECT *`)
      .then((result) => result)
      .catch((error) => error);
  }

  async getSectionContent(id) {
    // console.log(`prøver at hente : `+ id);
    return this.query(`SELECT content`, `iddocument_section = "${id}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  async getSection(id) {
    // console.log(`prøver at hente : `+ id);
    return this.query(`SELECT *`, `iddocument_section = "${id}"`)
      .then((result) => result)
      .catch((error) => error);
  }
}

module.exports = {
  Section,
};
