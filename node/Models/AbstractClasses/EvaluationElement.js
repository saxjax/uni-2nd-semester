const { Database } = require(`../Database/Database.js`);

class EvaluationElement extends Database {
  constructor() {
    super();
    this.name = `EvaluationElement`;
    this.table = null;
  }
}

module.exports = {
  EvaluationElement,
};
