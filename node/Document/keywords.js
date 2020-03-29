const { Database } = require(`../Database/Database.js`);

class Keyword extends Document {
  constructor(request) {
  super();
  this.name = `Keyword`;
  this.table = `document_keywords`;
  this.request = request;
  this.idkeyword = `Not set`;
  this.iddocuments = [];
  this.idevaluations =[];
  this.elementtype = `keyword`;
  this.keyword = `Not set`;
  
}

}
module.exports = {
  keyword,
};