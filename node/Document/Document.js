/* eslint no-console: off */

const { Database } = require(`../Database/Database.js`);

class Document extends Database {
  constructor(request) {
    super();
    this.name = `Document`;
    this.table = `document`;
    this.request = request;
    this.iddocument = `Not set`;
    this.file = request.files.section_file;
    this.filename = this.file.name;
    this.username = request.session.key;
  }

  // async getAllSections() {
  //   // console.log(`prøver at hente : `+ id);
  //   return this.query(`SELECT *`)
  //     .then((result) => result)
  //     .catch((error) => error);
  // }

  // async getSectionContent(id) {
  //   // console.log(`prøver at hente : `+ id);
  //   return this.query(`SELECT content`, `iddocument = "${id}"`)
  //     .then((result) => result)
  //     .catch((error) => error);
  // }

  // async getSection(id) {
  //   // console.log(`prøver at hente : `+ id);
  //   return this.query(`SELECT *`, `iddocument = "${id}"`)
  //     .then((result) => result)
  //     .catch((error) => error);
  // }

  async getKeywordsForEvaluation(id) {
    // console.log(`prøver at hente : ` + id);
    this.table = `document_keywords`;
    return this.query(`SELECT *`, `idevaluations = "${id}"`)
      .then((result) => result)
      .catch((error) => error);
  }

  async uploadDocument() {
    let uploadSuccessfull = false;
    if (this.request.files) {
      console.log(this.request.files);
      uploadSuccessfull = await this.uploadToArchive();
      if (uploadSuccessfull) {
        uploadSuccessfull = await this.insertDocumentToDB();
        console.log(uploadSuccessfull);
      }
    }
    return uploadSuccessfull;
  }

  async uploadToArchive() {
    try {
      await this.file.mv(`./node/FileUploads/${this.filename}`);
      return true;
    }
    catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async insertDocumentToDB() {
    // Perhaps insert a duplicate check and overwrite existing data if filename is the same.
    console.log(`Username: ${this.username}`);
    try {
      const insertdata = await this.query(`CUSTOM`, `INSERT INTO p2.document (creator_iduser,title) VALUES ("shit","fuck")`);
      console.log(insertdata);
      return true;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = {
  Document,
};
